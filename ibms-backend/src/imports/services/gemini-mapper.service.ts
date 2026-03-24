// PRIVACY: This service sends ONLY anonymised structural
// data to the Gemini API. Real personal data is stripped
// by the AnonymisationService before any external call.
// See anonymisation.service.ts
// Compliant with Ghana Data Protection Act 2012 (Act 843)

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ColumnMapping } from '../types/column-mapping.types';
import { CLIENT_TARGET_FIELDS } from '../types/column-mapping.types';

@Injectable()
export class GeminiMapperService {
  private readonly logger = new Logger(GeminiMapperService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Sends anonymised headers and sample rows to Gemini 1.5 Flash
   * for intelligent column mapping. Returns empty array on ANY failure.
   * Real personal data must NEVER reach this method.
   */
  async detectMappings(
    headers: string[],
    anonymisedRows: Record<string, string>[],
  ): Promise<ColumnMapping[]> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured — skipping AI mapping');
      return [];
    }

    const startTime = Date.now();

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        },
      });

      const prompt = this.buildPrompt(headers, anonymisedRows);

      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout after 15s')), 15000),
        ),
      ]);

      const responseText = result.response.text();

      this.logger.debug(
        `Gemini raw response (first 500 chars): ${responseText.substring(0, 500)}`,
      );

      const mappings = this.parseResponse(responseText, headers);

      this.logger.log(
        `AI mapping completed in ${Date.now() - startTime}ms. ` +
          `${mappings.length} columns mapped.`,
      );

      return mappings;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);

      if (errMsg.includes('429') || errMsg.includes('rate limit')) {
        this.logger.warn(
          'Gemini rate limit reached — falling back to rule-based mapping',
        );
      } else {
        this.logger.warn(
          `Gemini mapping failed: ${errMsg} — falling back to rule-based mapping`,
        );
      }

      return [];
    }
  }

  /** Builds the AI prompt with headers and anonymised sample data */
  private buildPrompt(
    headers: string[],
    anonymisedRows: Record<string, string>[],
  ): string {
    const fieldList = Object.entries(CLIENT_TARGET_FIELDS)
      .map(([key, info]) => `- ${key}: ${info.label} (${info.group})`)
      .join('\n');

    return `You are an expert data analyst specialising in insurance broker management systems in Ghana, West Africa.

A Ghanaian insurance broker has uploaded a spreadsheet containing their client data. Analyse the column headers and sample values, then map each column to the correct system field.

IMPORTANT CONTEXT:
- Ghanaian insurance brokerage system
- Ghana Card format: GHA-XXXXXXXXX-X
- Ghanaian phone numbers: 10 digits, start with 02/03/05/059
- Currency: GHS (Ghanaian Cedis)
- Address system: Ghana Post GPS digital addresses
- Ghana has 16 regions: Greater Accra, Ashanti, Western, Eastern, Central, Northern, Upper East, Upper West, Volta, Brong-Ahafo, Oti, Savannah, North East, Western North, Ahafo, Bono East

NOTE: Sample values are anonymised synthetic data that preserve format and structure only. No real personal information is included.

HEADERS AND ANONYMISED SAMPLES:
Headers: ${JSON.stringify(headers)}
Samples: ${JSON.stringify(anonymisedRows)}

AVAILABLE TARGET FIELDS (map to one of these exact keys, or "SKIP"):
${fieldList}

Return ONLY a raw JSON array. No markdown, no explanation, no code blocks.
Each element must have:
{
  "theirColumn": "exact header from their file",
  "ourField": "one of the field keys above or SKIP",
  "confidence": "high" | "medium" | "low",
  "reasoning": "brief explanation",
  "dataFormat": "format detected in sample data",
  "needsSplitting": true or false,
  "splitStrategy": "how to split if needed, else null",
  "transformations": ["list of needed transformations"],
  "warnings": ["any data quality concerns"]
}

RULES:
1. Return ONLY the JSON array. Raw JSON only.
2. Every column in the input must appear in the output.
3. If unsure, use confidence "low" and suggest the closest match.
4. If two columns contain the same field type, map primary first, secondary next.
5. For full_name columns, always set needsSplitting to true.`;
  }

  /**
   * Safely parses the Gemini JSON response. Falls back to
   * empty array if parsing fails for any reason.
   */
  private parseResponse(
    responseText: string,
    headers: string[],
  ): ColumnMapping[] {
    try {
      // Remove potential markdown code block wrappers
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7);
      }
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.slice(3);
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.slice(0, -3);
      }
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) {
        this.logger.warn('Gemini response is not an array');
        return [];
      }

      // Validate and normalise each mapping
      const mappings: ColumnMapping[] = parsed
        .filter(
          (item: Record<string, unknown>) =>
            item && typeof item === 'object' && item.theirColumn,
        )
        .map(
          (item: Record<string, unknown>): ColumnMapping => ({
            theirColumn: String(item.theirColumn || ''),
            ourField: String(item.ourField || 'SKIP'),
            confidence: (['high', 'medium', 'low'].includes(
              String(item.confidence),
            )
              ? String(item.confidence)
              : 'low') as 'high' | 'medium' | 'low',
            reasoning: String(item.reasoning || ''),
            dataFormat: String(item.dataFormat || ''),
            needsSplitting: Boolean(item.needsSplitting),
            splitStrategy: item.splitStrategy
              ? String(item.splitStrategy)
              : null,
            transformations: Array.isArray(item.transformations)
              ? (item.transformations as string[]).map(String)
              : [],
            warnings: Array.isArray(item.warnings)
              ? (item.warnings as string[]).map(String)
              : [],
            source: 'ai',
          }),
        );

      // Ensure every header is represented
      const mappedHeaders = new Set(
        mappings.map((m) => m.theirColumn),
      );
      for (const header of headers) {
        if (!mappedHeaders.has(header)) {
          mappings.push({
            theirColumn: header,
            ourField: 'SKIP',
            confidence: 'low',
            reasoning: 'Column not mapped by AI analysis',
            dataFormat: 'Unknown',
            needsSplitting: false,
            splitStrategy: null,
            transformations: [],
            warnings: ['AI did not return a mapping for this column'],
            source: 'ai',
          });
        }
      }

      return mappings;
    } catch (parseError) {
      this.logger.warn(
        `Failed to parse Gemini JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
      );
      return [];
    }
  }
}
