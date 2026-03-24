import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnonymisationService {
  private readonly logger = new Logger(AnonymisationService.name);

  // Fictional Ghanaian names for anonymisation replacing
  private readonly syntheticNames = [
    'Kwame Mensah',
    'Ama Owusu',
    'Kofi Asante',
    'Abena Boateng',
    'Yaw Darko',
    'Akua Sarpong',
  ];

  /**
   * Scans sample rows and their original headers to heuristically
   * detect personal data columns. It scrubs all real personal data
   * and replaces it with safe, synthetic, structurally accurate values.
   */
  public anonymiseSampleRows(
    headers: string[],
    sampleRows: Record<string, string>[],
  ): Record<string, string>[] {
    let replacedColumnsCount = 0;
    const detectedColumns = new Set<string>();

    const anonymisedRows = sampleRows.map((row) => {
      const safeRow: Record<string, string> = {};

      for (const header of headers) {
        const value = row[header];

        if (value === undefined || value === null || value === '') {
          safeRow[header] = '';
          continue;
        }

        const syntheticValue = this.getSyntheticValue(header, value);

        if (syntheticValue !== null) {
          safeRow[header] = syntheticValue;
          detectedColumns.add(header);
        } else {
          // Unidentified/unknown fields
          safeRow[header] = 'SAMPLE_VALUE';
        }
      }

      return safeRow;
    });

    replacedColumnsCount = detectedColumns.size;

    this.logger.log(
      `Anonymised ${sampleRows.length} rows. ${replacedColumnsCount} columns detected as personal data and replaced with synthetic values before AI analysis.`,
    );

    return anonymisedRows;
  }

  /**
   * Applies the detection rules specified to map personal values
   * into realistic fake string values for the LLM context.
   */
  private getSyntheticValue(header: string, value: string): string | null {
    const valStr = String(value).trim();
    const lcVal = valStr.toLowerCase();
    const lcHeader = header.toLowerCase();

    // 1. Detect GHANA CARD
    if (
      /^gha-\d{9}-\d$/i.test(valStr) ||
      lcVal.replace(/[-]/g, '').startsWith('gha')
    ) {
      return 'GHA-000000000-0';
    }

    // 2. Detect PHONE NUMBER
    if (
      /^\+?233\d{9}$/.test(valStr.replace(/\s+/g, '')) ||
      /^0[235]\d{8}$/.test(valStr.replace(/\s+/g, '')) ||
      /^059\d{7}$/.test(valStr.replace(/\s+/g, ''))
    ) {
      // Is Momo?
      if (lcHeader.includes('momo') || lcHeader.includes('mobile money') || lcHeader.includes('wallet')) {
        return '0550000000';
      }
      return '0244000000';
    }

    // 3. Detect EMAIL
    if (valStr.includes('@') && valStr.includes('.')) {
      return 'sample@example.com';
    }

    // 4. Detect DATE
    if (
      /^\d{1,4}[/\-]\d{1,2}[/\-]\d{1,4}$/.test(valStr) ||
      !isNaN(Date.parse(valStr))
    ) {
      // ensure we don't accidentally match tiny numbers
      if (valStr.length > 5) {
        return '01/01/1990';
      }
    }

    // 5. Detect TIN
    if (
      /^[cp]\d{10}$/i.test(valStr.replace(/\s+/g, '')) ||
      lcHeader.includes('tin') ||
      lcHeader.includes('tax id')
    ) {
      return 'C0000000000';
    }

    // 6. Detect ACCOUNT NUMBER
    if (
      /^\d{10,16}$/.test(valStr.replace(/[\s-]/g, '')) ||
      lcHeader.includes('account') ||
      lcHeader.includes('acc') ||
      lcHeader.includes('acct')
    ) {
      return '0000000000';
    }

    // 7. Detect AMOUNT / CURRENCY
    const justDigitsAndDots = valStr.replace(/[^\d.]/g, '');
    if (
      (!isNaN(Number(justDigitsAndDots)) && justDigitsAndDots.length > 0) ||
      lcHeader.includes('premium') ||
      lcHeader.includes('amount') ||
      lcHeader.includes('value') ||
      lcHeader.includes('sum')
    ) {
      // Must not be a phone wrapper
      if (valStr.length < 10 || lcHeader.includes('amount')) {
        return '5000';
      }
    }

    // 8. Detect BOOLEAN / YES-NO
    if (['yes', 'no', 'true', 'false', 'y', 'n', '1', '0'].includes(lcVal)) {
      return 'No';
    }

    // 9. Detect GENDER
    if (['male', 'female', 'm', 'f'].includes(lcVal)) {
      return 'Male';
    }

    // 10. Detect DIGITAL ADDRESS
    if (/^[a-z]{2}-\d{3,4}-\d{4}$/i.test(valStr)) {
      return 'GA-000-0000';
    }

    // 11. Detect ADDRESS
    if (
      /\d+\s+[a-z]+/i.test(valStr) ||
      lcHeader.includes('address') ||
      lcHeader.includes('location') ||
      lcHeader.includes('street') ||
      lcVal.includes('street') ||
      lcVal.includes('avenue') ||
      lcVal.includes('road')
    ) {
      return '14 Sample Street';
    }

    // 12. Detect REGION
    const ghanaRegions = [
      'greater accra',
      'ashanti',
      'western',
      'eastern',
      'central',
      'northern',
      'upper east',
      'upper west',
      'volta',
      'brong',
      'oti',
      'savannah',
      'north east',
      'western north',
      'ahafo',
      'bono',
    ];
    if (ghanaRegions.some((r) => lcVal.includes(r))) {
      return 'Greater Accra';
    }

    // 13. Detect CITY
    if (
      lcHeader.includes('city') ||
      lcHeader.includes('town') ||
      lcHeader.includes('district')
    ) {
      return 'Accra';
    }

    // 14. Detect BANK NAME
    if (lcHeader.includes('bank') || lcVal.includes('bank')) {
      return 'Sample Bank Ghana';
    }

    // 15. Detect CLIENT TYPE
    if (['individual', 'corporate', 'personal', 'business'].includes(lcVal)) {
      return 'Individual';
    }

    // 16. Detect NAME
    // Name has 2-4 words with capital letters, no special characters except hyphens
    if (/^[a-zA-Z-\s]+$/.test(valStr)) {
      const words = valStr.trim().split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        // Pick a random synthetic name deterministically by string length
        const index = valStr.length % this.syntheticNames.length;
        return this.syntheticNames[index];
      }
    }

    return null;
  }
}
