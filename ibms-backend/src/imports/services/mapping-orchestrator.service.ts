import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnonymisationService } from '../anonymisation.service';
import { GeminiMapperService } from './gemini-mapper.service';
import { RuleBasedMapperService } from './rule-based-mapper.service';
import type {
  ColumnMapping,
  MappingOrchestratorResult,
} from '../types/column-mapping.types';

@Injectable()
export class MappingOrchestratorService {
  private readonly logger = new Logger(MappingOrchestratorService.name);

  constructor(
    private readonly anonymise: AnonymisationService,
    private readonly gemini: GeminiMapperService,
    private readonly rules: RuleBasedMapperService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Orchestrates column mapping detection by combining the instant
   * rule-based mapper with the AI-powered Gemini mapper.
   *
   * Flow:
   * 1. Run rule-based mapper first (instant, free, always available)
   * 2. If AI is enabled and there are uncertain columns, run Gemini
   *    with anonymised data only
   * 3. Merge results: AI wins where it has higher confidence
   * 4. On any AI failure, silently fall back to rule-based results
   */
  async detectMappings(
    headers: string[],
    realSampleRows: Record<string, unknown>[],
    jobId: string,
    tenantId: string,
  ): Promise<MappingOrchestratorResult> {
    const startTime = Date.now();

    // Step 1: Always run rule-based mapper first (instant baseline)
    const ruleResults = this.rules.detectMappings(headers);

    // Step 2: Count columns that need AI help
    const needsAI = ruleResults.filter((m) => m.confidence !== 'high').length;

    const aiEnabled = this.config.get<string>('ENABLE_AI_MAPPING') === 'true';

    let aiUsed = false;
    let aiCallSucceeded = false;
    let columnsFromAI = 0;
    let columnsFromRules = ruleResults.length;
    let finalMappings: ColumnMapping[] = [...ruleResults];

    // Step 3: If AI is enabled and there are uncertain columns, call Gemini
    if (aiEnabled && needsAI > 0) {
      aiUsed = true;

      this.logger.log(
        `AI mapping requested for job ${jobId}. ` +
          `Anonymising ${headers.length} columns before external AI call. ` +
          `Zero real personal data will be transmitted.`,
      );

      // Convert to string records for anonymisation
      const stringRows = realSampleRows.map((row) => {
        const stringRow: Record<string, string> = {};
        for (const [key, value] of Object.entries(row)) {
          stringRow[key] =
            value !== null && value !== undefined ? String(value) : '';
        }
        return stringRow;
      });

      // Anonymise before any external call
      const anonymisedRows = this.anonymise.anonymiseSampleRows(
        headers,
        stringRows,
      );

      // Call Gemini with anonymised data ONLY
      const aiResults = await this.gemini.detectMappings(
        headers,
        anonymisedRows,
      );

      if (aiResults.length > 0) {
        aiCallSucceeded = true;

        // Step 4: Merge results — AI wins where confidence >= rule confidence
        finalMappings = this.mergeResults(ruleResults, aiResults);

        columnsFromAI = finalMappings.filter((m) => m.source === 'ai').length;
        columnsFromRules = finalMappings.filter(
          (m) => m.source === 'rules',
        ).length;

        this.logger.log(
          `AI/Rule merge for job ${jobId}: ${columnsFromAI} from AI, ` +
            `${columnsFromRules} from rules`,
        );
      } else {
        this.logger.log(
          `AI returned no results for job ${jobId}. Using rule-based results only.`,
        );
      }
    }

    const unmappedColumns = finalMappings
      .filter((m) => m.ourField === 'SKIP' && m.confidence === 'low')
      .map((m) => m.theirColumn);

    const processingTimeMs = Date.now() - startTime;

    return {
      mappings: finalMappings,
      aiUsed,
      aiCallSucceeded,
      columnsFromAI,
      columnsFromRules,
      unmappedColumns,
      processingTimeMs,
      privacyNote:
        'Column mapping used anonymised structural data only. ' +
        'No personal client data was transmitted to any external service.',
    };
  }

  /**
   * Merges rule-based and AI mappings. For each column:
   * - If rule-based has high confidence → keep it (AI is bonus confirmation)
   * - If AI has higher or equal confidence than rules → use AI
   * - If AI didn't map the column → keep rule-based result
   */
  private mergeResults(
    ruleResults: ColumnMapping[],
    aiResults: ColumnMapping[],
  ): ColumnMapping[] {
    const aiMap = new Map<string, ColumnMapping>();
    for (const ai of aiResults) {
      aiMap.set(ai.theirColumn, ai);
    }

    const confidenceRank: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return ruleResults.map((ruleMapping) => {
      const aiMapping = aiMap.get(ruleMapping.theirColumn);

      if (!aiMapping) {
        return ruleMapping;
      }

      // If rule-based is high confidence, keep it
      if (ruleMapping.confidence === 'high') {
        return { ...ruleMapping, source: 'rules' as const };
      }

      // If AI has higher or equal confidence, use AI
      const ruleRank = confidenceRank[ruleMapping.confidence] || 0;
      const aiRank = confidenceRank[aiMapping.confidence] || 0;

      if (aiRank >= ruleRank) {
        return { ...aiMapping, source: 'ai' as const };
      }

      return { ...ruleMapping, source: 'rules' as const };
    });
  }
}
