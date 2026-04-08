import { Injectable, Logger } from '@nestjs/common';
import type { ColumnMapping } from '../types/column-mapping.types';

/**
 * Comprehensive alias dictionary for mapping user column headers
 * to system field keys. This runs entirely locally with zero
 * external API calls and serves as the primary fallback when
 * Gemini AI is unavailable or rate-limited.
 */
const FIELD_ALIASES: Record<string, string[]> = {
  first_name: [
    'first name',
    'firstname',
    'given name',
    'forename',
    'fname',
    'f name',
    'first',
    'christian name',
  ],
  last_name: [
    'last name',
    'lastname',
    'surname',
    'family name',
    'lname',
    'l name',
    'last',
    'other names',
  ],
  full_name: [
    'full name',
    'fullname',
    'name',
    'client name',
    'customer name',
    'policyholder',
    'insured',
    'insured name',
    'contact name',
    'member name',
    'member',
    'customer',
    'client',
    'account name',
  ],
  company_name: [
    'company',
    'company name',
    'business name',
    'organisation',
    'organization',
    'firm name',
    'business',
    'enterprise',
    'corporate name',
  ],
  phone_primary: [
    'phone',
    'phone number',
    'mobile',
    'mobile number',
    'cell',
    'cell number',
    'tel',
    'telephone',
    'contact',
    'contact number',
    'primary phone',
    'phone 1',
    'phone no',
    'phone no.',
    'gsm',
    'mobile no',
    'mobile no.',
    'handset',
    'phone/mobile',
    'telephone number',
  ],
  phone_secondary: [
    'phone 2',
    'second phone',
    'other phone',
    'alternative phone',
    'alt phone',
    'other number',
    'secondary phone',
    'phone number 2',
    'mobile 2',
  ],
  email: [
    'email',
    'email address',
    'e-mail',
    'e mail',
    'mail',
    'electronic mail',
    'email id',
    'email add',
    'e mail address',
  ],
  ghana_card_number: [
    'ghana card',
    'ghana card number',
    'card no',
    'card number',
    'national id',
    'national id number',
    'id number',
    'id no',
    'id no.',
    'nia number',
    'ghana card no',
    'identification number',
    'id card',
    'national identification',
    'nia',
  ],
  date_of_birth: [
    'date of birth',
    'dob',
    'd.o.b',
    'd.o.b.',
    'birth date',
    'birthdate',
    'born',
    'birth',
    'date of birth (dd/mm/yyyy)',
    'birthday',
  ],
  tin: [
    'tin',
    'tax id',
    'tax identification',
    'tax number',
    'tax identification number',
    'gra number',
    'gra tin',
    'tax id number',
  ],
  gender: ['gender', 'sex', 'm/f', 'male/female'],
  marital_status: ['marital status', 'marital', 'civil status'],
  nationality: ['nationality', 'country', 'citizen'],
  digital_address: [
    'digital address',
    'gps address',
    'ghana post',
    'ghana post gps',
    'gps',
    'digital',
    'post gps',
    'digital add',
    'gps add',
  ],
  residential_address: [
    'address',
    'residential address',
    'home address',
    'street address',
    'physical address',
    'house address',
    'street',
    'location address',
    'res address',
  ],
  city: ['city', 'town', 'city/town', 'town/city'],
  region: ['region', 'province', 'state', 'area', 'zone', 'location region'],
  occupation: [
    'occupation',
    'job',
    'profession',
    'employment',
    'job title',
    'work',
    'trade',
    'vocation',
    'occupation/profession',
  ],
  employer: [
    'employer',
    'employer name',
    'workplace',
    'place of work',
    'work place',
  ],
  industry: ['industry', 'sector', 'field'],
  client_type: [
    'type',
    'client type',
    'customer type',
    'category',
    'account type',
    'individual or corporate',
    'individual/corporate',
    'client category',
  ],
  bank_name: [
    'bank',
    'bank name',
    'financial institution',
    'bank of account',
    'banking institution',
  ],
  account_number: [
    'account number',
    'acc no',
    'acc number',
    'account no',
    'account no.',
    'bank account',
    'bank account number',
    'acct no',
    'acct number',
    'acct',
    'a/c no',
    'a/c number',
  ],
  account_name: [
    'account name',
    'acc name',
    'account holder',
    'account holder name',
    'name on account',
    'bank account name',
  ],
  branch: ['branch', 'bank branch', 'branch name', 'banking branch'],
  momo_network: [
    'momo network',
    'network',
    'momo provider',
    'mobile money network',
    'mtn/vodafone/airteltigo',
    'mm network',
    'momo',
  ],
  momo_number: [
    'momo number',
    'mobile money number',
    'momo no',
    'wallet number',
    'mm number',
    'mobile money no',
    'momo phone',
  ],
  momo_account_name: [
    'momo name',
    'mobile money name',
    'momo account name',
    'mm name',
    'wallet name',
  ],
  aml_risk: [
    'aml',
    'aml risk',
    'risk level',
    'risk rating',
    'aml risk level',
    'risk',
    'aml level',
    'money laundering risk',
  ],
  pep: [
    'pep',
    'politically exposed',
    'politically exposed person',
    'pep status',
    'is pep',
  ],
  source_of_funds: [
    'source of funds',
    'funds source',
    'income source',
    'source of income',
    'fund source',
    'source of wealth',
  ],
  purpose_of_relationship: [
    'purpose',
    'purpose of relationship',
    'relationship purpose',
    'insurance type',
    'type of insurance',
    'reason',
  ],
  expected_annual_volume: [
    'expected volume',
    'annual volume',
    'expected annual',
    'annual premium',
    'expected premium',
    'annual transaction volume',
  ],
  status: [
    'status',
    'client status',
    'active status',
    'account status',
    'record status',
  ],
  notes: [
    'notes',
    'remarks',
    'comments',
    'additional info',
    'other info',
    'extra',
    'note',
    'comment',
  ],
  assigned_officer: [
    'officer',
    'account officer',
    'broker',
    'agent',
    'assigned to',
    'relationship manager',
    'rm',
  ],
  passport_number: [
    'passport',
    'passport number',
    'passport no',
    'international passport',
  ],
  drivers_licence: [
    'drivers licence',
    'driver licence',
    'driving licence',
    'license',
    'licence no',
    'license number',
  ],
  ssnit: [
    'ssnit',
    'ssnit number',
    'social security',
    'social security number',
    'ss number',
  ],
  whatsapp_number: ['whatsapp', 'whatsapp number', 'wa number', 'whatsapp no'],
};

@Injectable()
export class RuleBasedMapperService {
  private readonly logger = new Logger(RuleBasedMapperService.name);

  /**
   * Detects column mappings using a comprehensive alias dictionary.
   * Runs synchronously with zero external calls. Always available.
   */
  detectMappings(headers: string[]): ColumnMapping[] {
    const mappings: ColumnMapping[] = [];

    for (const header of headers) {
      const normalised = this.normalise(header);
      let bestMatch: {
        field: string;
        confidence: 'high' | 'medium' | 'low';
      } | null = null;

      // Pass 1: Exact match (high confidence)
      for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
        if (aliases.some((a) => this.normalise(a) === normalised)) {
          bestMatch = { field, confidence: 'high' };
          break;
        }
      }

      // Pass 2: Header contains alias as substring (medium)
      if (!bestMatch) {
        for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
          if (aliases.some((a) => normalised.includes(this.normalise(a)))) {
            bestMatch = { field, confidence: 'medium' };
            break;
          }
        }
      }

      // Pass 3: Alias contains header as substring (medium)
      if (!bestMatch) {
        for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
          if (aliases.some((a) => this.normalise(a).includes(normalised))) {
            bestMatch = { field, confidence: 'medium' };
            break;
          }
        }
      }

      if (bestMatch) {
        mappings.push({
          theirColumn: header,
          ourField: bestMatch.field,
          confidence: bestMatch.confidence,
          reasoning:
            bestMatch.confidence === 'high'
              ? `Exact alias match for "${bestMatch.field}"`
              : `Partial alias match for "${bestMatch.field}"`,
          dataFormat: 'Detected via rule-based analysis',
          needsSplitting: bestMatch.field === 'full_name',
          splitStrategy:
            bestMatch.field === 'full_name'
              ? 'Split into firstName, middleName, lastName by whitespace'
              : null,
          transformations: [],
          warnings: [],
          source: 'rules',
        });
      } else {
        mappings.push({
          theirColumn: header,
          ourField: 'SKIP',
          confidence: 'low',
          reasoning: 'Column not recognised — please map manually',
          dataFormat: 'Unknown',
          needsSplitting: false,
          splitStrategy: null,
          transformations: [],
          warnings: ['This column was not automatically recognised'],
          source: 'rules',
        });
      }
    }

    this.logger.log(
      `Rule-based mapping completed: ${mappings.filter((m) => m.confidence === 'high').length} high, ` +
        `${mappings.filter((m) => m.confidence === 'medium').length} medium, ` +
        `${mappings.filter((m) => m.confidence === 'low').length} low confidence`,
    );

    return mappings;
  }

  /** Normalise a header string for comparison */
  private normalise(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[\s_\-#./()]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
