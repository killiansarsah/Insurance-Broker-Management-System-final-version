import * as XLSX from 'xlsx';
import type { ImportEntityType, ImportColumnMapping, ImportValidationError } from '@/types';

// ============================================================
// Field definitions for each importable entity type
// ============================================================

interface FieldDef {
    key: string;
    label: string;
    required: boolean;
    aliases: string[];  // fuzzy-match column names from user files
    validate?: (value: string) => string | null; // Returns error message or null
}

const PHONE_REGEX = /^(\+233|0)\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePhone(value: string): string | null {
    if (!value) return null;
    const cleaned = value.replace(/[\s\-()]/g, '');
    if (!PHONE_REGEX.test(cleaned)) return `Invalid phone format: "${value}". Expected +233XXXXXXXXX or 0XXXXXXXXX`;
    return null;
}

function validateEmail(value: string): string | null {
    if (!value) return null;
    if (!EMAIL_REGEX.test(value)) return `Invalid email format: "${value}"`;
    return null;
}

function validateDate(value: string): string | null {
    if (!value) return null;

    // Check for DD/MM/YYYY or DD/MM/YY
    const dmyRegex = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/;
    const match = value.match(dmyRegex);

    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        let year = parseInt(match[3], 10);

        if (year < 100) year += 2000; // Handle YY

        const d = new Date(year, month - 1, day);
        if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
            return null;
        }
    }

    const d = new Date(value);
    if (isNaN(d.getTime())) return `Invalid date: "${value}". Expected DD/MM/YYYY or similar.`;
    return null;
}

function validateNumber(value: string): string | null {
    if (!value) return null;
    const cleaned = String(value).replace(/[^\d\.]/g, ''); // Remove currency symbols, commas
    if (isNaN(Number(cleaned))) return `Not a valid number: "${value}"`;
    return null;
}

// --- Client Fields ---
const CLIENT_FIELDS: FieldDef[] = [
    { key: 'firstName', label: 'First Name', required: true, aliases: ['first name', 'first_name', 'fname', 'given name', 'insured'] },
    { key: 'lastName', label: 'Last Name', required: true, aliases: ['last name', 'last_name', 'lname', 'surname', 'family name'] },
    { key: 'type', label: 'Client Type', required: false, aliases: ['client type', 'type', 'category'] },
    { key: 'ghanaCardNumber', label: 'Ghana Card Number', required: true, aliases: ['ghana card', 'ghana card number', 'ghana_card', 'national id', 'id number', 'card number'] },
    { key: 'phone', label: 'Phone', required: true, aliases: ['phone', 'phone number', 'mobile', 'tel', 'telephone', 'contact'], validate: validatePhone },
    { key: 'email', label: 'Email', required: false, aliases: ['email', 'email address', 'e-mail'], validate: validateEmail },
    { key: 'dateOfBirth', label: 'Date of Birth', required: false, aliases: ['date of birth', 'dob', 'birth date', 'birthday'], validate: validateDate },
    { key: 'gender', label: 'Gender', required: false, aliases: ['gender', 'sex'] },
    { key: 'nationality', label: 'Nationality', required: false, aliases: ['nationality', 'country'] },
    { key: 'digitalAddress', label: 'Digital Address', required: false, aliases: ['digital address', 'gps address', 'address', 'location'] },
    { key: 'region', label: 'Region', required: false, aliases: ['region', 'state', 'province'] },
    { key: 'city', label: 'City', required: false, aliases: ['city', 'town'] },
    { key: 'companyName', label: 'Company Name', required: false, aliases: ['company', 'company name', 'business name', 'organisation', 'organization', 'insured'] },
    { key: 'tin', label: 'TIN', required: false, aliases: ['tin', 'tax id', 'tax identification', 'tax number'] },
];

// --- Policy Fields ---
const POLICY_FIELDS: FieldDef[] = [
    { key: 'policyNumber', label: 'Policy Number', required: true, aliases: ['policy number', 'policy no', 'policy #', 'policy_number', 'pol no'] },
    { key: 'insuranceType', label: 'Insurance Type', required: true, aliases: ['insurance type', 'type', 'product', 'product type', 'category', 'class', 'policy'] },
    { key: 'clientName', label: 'Client Name', required: true, aliases: ['client', 'client name', 'insured', 'insured name', 'policyholder'] },
    { key: 'insurerName', label: 'Insurer/Carrier', required: true, aliases: ['insurer', 'carrier', 'underwriter', 'insurance company', 'insurer name'] },
    { key: 'status', label: 'Status', required: false, aliases: ['status', 'policy status'] },
    { key: 'inceptionDate', label: 'Start Date', required: true, aliases: ['inception', 'inception date', 'start date', 'effective date', 'commencement', 'date of issue'], validate: validateDate },
    { key: 'expiryDate', label: 'Expiry Date', required: true, aliases: ['expiry', 'expiry date', 'end date', 'maturity', 'termination date', 'date of expiry'], validate: validateDate },
    { key: 'sumInsured', label: 'Sum Insured', required: false, aliases: ['sum insured', 'sum_insured', 'coverage amount', 'insured value'], validate: validateNumber },
    { key: 'premiumAmount', label: 'Premium Amount', required: true, aliases: ['premium', 'premium amount', 'annual premium', 'premium_amount'], validate: validateNumber },
    { key: 'commissionRate', label: 'Commission Rate (%)', required: false, aliases: ['commission rate', 'commission %', 'rate'], validate: validateNumber },
    { key: 'commissionAmount', label: 'Commission Amount', required: false, aliases: ['commission', 'commission amount', 'brokerage', 'gross comm.', 'net comm.'], validate: validateNumber },
    { key: 'coverageDetails', label: 'Coverage Details', required: false, aliases: ['coverage details', 'policy type', 'vehicle number/ location'] },
];

// --- Claim Fields ---
const CLAIM_FIELDS: FieldDef[] = [
    { key: 'claimNumber', label: 'Claim Number', required: true, aliases: ['claim number', 'claim no', 'claim #', 'claim_number'] },
    { key: 'policyNumber', label: 'Policy Number', required: true, aliases: ['policy number', 'policy no', 'policy #', 'policy_number'] },
    { key: 'clientName', label: 'Client Name', required: true, aliases: ['client', 'client name', 'claimant', 'insured'] },
    { key: 'insuranceType', label: 'Insurance Type', required: false, aliases: ['insurance type', 'type', 'class'] },
    { key: 'status', label: 'Claim Status', required: false, aliases: ['status', 'claim status'] },
    { key: 'incidentDate', label: 'Date of Loss', required: true, aliases: ['incident date', 'date of loss', 'loss date', 'event date'], validate: validateDate },
    { key: 'incidentDescription', label: 'Description', required: false, aliases: ['description', 'incident description', 'loss description', 'details'] },
    { key: 'claimAmount', label: 'Claim Amount', required: true, aliases: ['claim amount', 'amount claimed', 'loss amount', 'amount'], validate: validateNumber },
    { key: 'assessedAmount', label: 'Assessed Amount', required: false, aliases: ['assessed amount', 'assessed', 'survey amount'], validate: validateNumber },
    { key: 'settledAmount', label: 'Settled Amount', required: false, aliases: ['settled amount', 'settlement', 'paid amount'], validate: validateNumber },
    { key: 'intimationDate', label: 'Intimation Date', required: false, aliases: ['intimation date', 'notified date', 'reported date'], validate: validateDate },
];

const LEAD_FIELDS: FieldDef[] = [
    { key: 'contactName', label: 'Contact Name', required: true, aliases: ['contact name', 'name', 'full name', 'prospect name'] },
    { key: 'companyName', label: 'Company Name', required: false, aliases: ['company', 'company name', 'business'] },
    { key: 'phone', label: 'Phone', required: true, aliases: ['phone', 'phone number', 'mobile', 'tel', 'contact number'], validate: validatePhone },
    { key: 'email', label: 'Email', required: false, aliases: ['email', 'email address'], validate: validateEmail },
    { key: 'source', label: 'Lead Source', required: false, aliases: ['source', 'lead source', 'channel', 'referral source'] },
    { key: 'priority', label: 'Priority', required: false, aliases: ['priority', 'lead priority', 'temperature', 'hot/warm/cold'] },
    { key: 'productInterest', label: 'Product Interest', required: false, aliases: ['product interest', 'product', 'interest', 'insurance type'] },
    { key: 'estimatedPremium', label: 'Estimated Premium', required: false, aliases: ['estimated premium', 'premium', 'est premium', 'expected premium'], validate: validateNumber },
    { key: 'notes', label: 'Notes', required: false, aliases: ['notes', 'comments', 'remarks'] },
];

// --- Universal Fields (Combined for Relational Import) ---
const UNIVERSAL_FIELDS: (FieldDef & { group: 'client' | 'policy' | 'asset' })[] = [
    // Client Info
    { group: 'client', key: 'firstName', label: 'Client First Name', required: true, aliases: ['first name', 'first_name', 'fname', 'insured'] },
    { group: 'client', key: 'lastName', label: 'Client Last Name', required: true, aliases: ['last name', 'last_name', 'lname', 'surname'] },
    { group: 'client', key: 'ghanaCardNumber', label: 'Ghana Card', required: false, aliases: ['ghana card', 'id number'] },
    { group: 'client', key: 'companyName', label: 'Company Name', required: false, aliases: ['company', 'organisation', 'insured'] },

    // Policy Info
    { group: 'policy', key: 'policyNumber', label: 'Policy Number', required: true, aliases: ['policy number', 'policy no', 'pol no'] },
    { group: 'policy', key: 'insuranceType', label: 'Insurance Type', required: true, aliases: ['insurance type', 'product', 'class', 'policy'] },
    { group: 'policy', key: 'insurerName', label: 'Insurer Name', required: true, aliases: ['insurer', 'carrier', 'insurance company'] },
    { group: 'policy', key: 'inceptionDate', label: 'Effective Date', required: true, aliases: ['inception', 'start date', 'date of issue'], validate: validateDate },
    { group: 'policy', key: 'expiryDate', label: 'Expiry Date', required: true, aliases: ['expiry', 'end date', 'date of expiry'], validate: validateDate },
    { group: 'policy', key: 'premiumAmount', label: 'Premium Amount', required: true, aliases: ['premium', 'premium amount'], validate: validateNumber },
    { group: 'policy', key: 'commissionAmount', label: 'Comm. Amount', required: false, aliases: ['commission', 'gross comm.', 'net comm.'], validate: validateNumber },

    // Asset Info
    { group: 'asset', key: 'assetDetails', label: 'Vehicle/Asset Details', required: false, aliases: ['vehicle number/ location', 'location', 'asset', 'vehicle no'] },
];

// ============================================================
// Public API
// ============================================================

const ENTITY_FIELDS: Record<Exclude<ImportEntityType, 'universal'>, FieldDef[]> = {
    clients: CLIENT_FIELDS,
    policies: POLICY_FIELDS,
    claims: CLAIM_FIELDS,
    leads: LEAD_FIELDS,
};

/**
 * Returns the field definitions for a given entity type.
 */
export function getFieldsForEntity(entityType: ImportEntityType): FieldDef[] {
    if (entityType === 'universal') {
        return UNIVERSAL_FIELDS;
    }
    return ENTITY_FIELDS[entityType];
}

/**
 * Returns the expected template columns for a given entity type (for downloadable templates).
 */
export function getTemplateColumns(entityType: ImportEntityType): string[] {
    const fields = getFieldsForEntity(entityType);
    return fields.map(f => f.label);
}

/**
 * Generates and downloads a CSV template for the given entity type.
 */
export function downloadTemplate(entityType: ImportEntityType) {
    const columns = getTemplateColumns(entityType);
    const csvContent = columns.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ibms_${entityType}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Parses a CSV or Excel file into a 2D string array without header.
 * First element is the header row.
 */
export async function parseFile(file: File): Promise<string[][]> {
    const buffer = await file.arrayBuffer();
    // cellDates: true converts Excel serial dates to JS Date objects automatically
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: unknown[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

    // Trim whitespace from all cells and filter completely empty rows
    return data
        .map(row => (row as unknown[]).map(cell => {
            if (cell instanceof Date) {
                // Format date as DD/MM/YYYY for consistency
                const d = cell;
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            }
            return String(cell).trim();
        }))
        .filter(row => row.some(cell => cell !== ''));
}

/**
 * Returns column names from the first row of parsed data.
 */
export function detectColumns(data: string[][]): string[] {
    if (data.length === 0) return [];
    // Only return non-empty columns to avoid duplicate key errors in mapping UI
    return data[0].filter(col => col.trim() !== '');
}

/**
 * Auto-maps columns from the uploaded file to IBMS fields using fuzzy matching.
 */
export function autoMapColumns(
    sourceColumns: string[],
    entityType: ImportEntityType
): ImportColumnMapping[] {
    const fields = getFieldsForEntity(entityType);

    return sourceColumns.map(sourceCol => {
        const normalized = sourceCol.toLowerCase().trim().replace(/[_\-]/g, ' ');

        // Find the best matching field
        let bestMatch: (FieldDef & { group?: string }) | undefined;
        let bestScore = 0;

        for (const field of fields) {
            // Exact match on key
            if (normalized === field.key.toLowerCase()) {
                bestMatch = field;
                bestScore = 100;
                break;
            }
            // Exact match on label
            if (normalized === field.label.toLowerCase()) {
                bestMatch = field;
                bestScore = 99;
                break;
            }
            // Alias match
            for (const alias of field.aliases) {
                if (normalized === alias || normalized.includes(alias) || alias.includes(normalized)) {
                    const score = normalized === alias ? 95 : 80;
                    if (score > bestScore) {
                        bestMatch = field;
                        bestScore = score;
                    }
                }
            }
        }

        return {
            sourceColumn: sourceCol,
            targetField: bestMatch && bestScore > 50 ? bestMatch.key : '',
            isRequired: bestMatch?.required ?? false,
            entityGroup: (bestMatch as (FieldDef & { group?: 'client' | 'policy' | 'asset' }))?.group,
        };
    });
}

/**
 * Validates a parsed row against the field definitions.
 */
export function validateRow(
    row: Record<string, string>,
    entityType: ImportEntityType,
    rowIndex: number
): ImportValidationError[] {
    const fields = getFieldsForEntity(entityType);
    const errors: ImportValidationError[] = [];

    for (const field of fields) {
        const value = row[field.key] || '';

        // Required field check
        if (field.required && !value) {
            errors.push({
                row: rowIndex,
                column: field.label,
                value: '',
                message: `Missing required field "${field.label}"`,
                entityGroup: (field as (FieldDef & { group?: string })).group,
            });
            continue;
        }

        // Format validation
        if (value && field.validate) {
            const error = field.validate(value);
            if (error) {
                errors.push({
                    row: rowIndex,
                    column: field.label,
                    value,
                    message: error,
                    entityGroup: (field as (FieldDef & { group?: string })).group,
                });
            }
        }
    }

    return errors;
}

/**
 * Detects duplicates between imported data and existing data.
 * Returns the set of row indices that are duplicates.
 */
export function detectDuplicates(
    rows: Record<string, string>[],
    entityType: ImportEntityType,
    existingData: Record<string, unknown>[]
): Set<number> {
    const duplicateIndices = new Set<number>();

    // Determine unique key based on entity type
    const getKey = (row: Record<string, unknown>): string => {
        if (entityType === 'universal') {
            // For universal, a duplicate is often same client + same policy number
            return `${String(row.clientName || '').toLowerCase()}|${String(row.policyNumber || '').toLowerCase()}`;
        }

        switch (entityType) {
            case 'clients':
                return String(row.ghanaCardNumber || '').toLowerCase();
            case 'policies':
                return String(row.policyNumber || '').toLowerCase();
            case 'claims':
                return String(row.claimNumber || '').toLowerCase();
            case 'leads': {
                const email = String(row.email || '').toLowerCase();
                const phone = String(row.phone || '').replace(/[\s\-()]/g, '');
                return `${email}|${phone}`;
            }
            default:
                return '';
        }
    };

    // Build set of existing keys
    const existingKeys = new Set(existingData.map(item => getKey(item)));

    // Also track within the import batch for intra-file duplicates
    const seenKeys = new Set<string>();

    rows.forEach((row, index) => {
        const key = getKey(row as Record<string, unknown>);
        if (!key || key === '|') return; // Skip if no key

        if (existingKeys.has(key) || seenKeys.has(key)) {
            duplicateIndices.add(index);
        }
        seenKeys.add(key);
    });

    return duplicateIndices;
}

/**
 * Converts mapped row data into the proper data structure for each entity type.
 * Applies sensible defaults.
 */
export function buildRecord(
    row: Record<string, string>,
    entityType: ImportEntityType
): Record<string, unknown> {
    const now = new Date().toISOString();
    const id = `imported-${entityType.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (entityType === 'universal') {
        // Universal mode creates a composite object that the UI will split
        return {
            _entity: 'universal',
            client: buildRecord(row, 'clients'),
            policy: buildRecord(row, 'policies'),
            asset: {
                id: `imported-ast-${Date.now()}`,
                details: row.assetDetails || '',
            }
        };
    }

    switch (entityType) {
        case 'clients':
            return {
                id,
                clientNumber: `CLT-${Date.now().toString().slice(-6)}`,
                type: (row.type?.toLowerCase() === 'corporate' ? 'corporate' : 'individual') as string,
                status: 'active',
                firstName: row.firstName || '',
                lastName: row.lastName || '',
                ghanaCardNumber: row.ghanaCardNumber || '',
                phone: row.phone || '',
                email: row.email || '',
                dateOfBirth: row.dateOfBirth || '',
                gender: row.gender?.toLowerCase() || '',
                nationality: row.nationality || 'Ghanaian',
                digitalAddress: row.digitalAddress || '',
                region: row.region || '',
                city: row.city || '',
                companyName: row.companyName || '',
                tin: row.tin || '',
                kycStatus: 'pending',
                amlRiskLevel: 'low',
                isPep: false,
                eddRequired: false,
                totalPolicies: 0,
                totalPremium: 0,
                activePolicies: 0,
                createdAt: now,
                updatedAt: now,
            };

        case 'policies':
            return {
                id,
                policyNumber: row.policyNumber || '',
                status: row.status || 'active',
                insuranceType: row.insuranceType || 'other',
                clientId: '',
                clientName: row.clientName || row.firstName ? `${row.firstName} ${row.lastName}` : '',
                insurerName: row.insurerName || '',
                insurerId: '',
                brokerId: '',
                brokerName: '',
                inceptionDate: row.inceptionDate || now,
                expiryDate: row.expiryDate || now,
                issueDate: row.inceptionDate || now,
                sumInsured: Number(row.sumInsured) || 0,
                premiumAmount: Number(row.premiumAmount?.replace(/[^\d\.]/g, '')) || 0,
                commissionRate: Number(row.commissionRate) || 0,
                commissionAmount: Number(row.commissionAmount?.replace(/[^\d\.]/g, '')) || 0,
                currency: 'GHS',
                isRenewal: false,
                createdAt: now,
                updatedAt: now,
            };

        case 'claims':
            return {
                id,
                claimNumber: row.claimNumber || '',
                status: row.status || 'registered',
                policyId: '',
                policyNumber: row.policyNumber || '',
                insuranceType: row.insuranceType || 'other',
                clientId: '',
                clientName: row.clientName || '',
                incidentDate: row.incidentDate || now,
                incidentDescription: row.incidentDescription || '',
                claimAmount: Number(row.claimAmount?.replace(/[^\d\.]/g, '')) || 0,
                assessedAmount: row.assessedAmount ? Number(row.assessedAmount.replace(/[^\d\.]/g, '')) : undefined,
                settledAmount: row.settledAmount ? Number(row.settledAmount.replace(/[^\d\.]/g, '')) : undefined,
                currency: 'GHS',
                intimationDate: row.intimationDate || now,
                acknowledgmentDeadline: now,
                processingDeadline: now,
                isOverdue: false,
                createdAt: now,
                updatedAt: now,
            };

        case 'leads':
            return {
                id,
                leadNumber: `LD-${Date.now().toString().slice(-6)}`,
                status: 'new',
                priority: row.priority || 'warm',
                source: row.source || 'other',
                contactName: row.contactName || '',
                companyName: row.companyName || '',
                phone: row.phone || '',
                email: row.email || '',
                productInterest: row.productInterest ? [row.productInterest] : [],
                estimatedPremium: row.estimatedPremium ? Number(row.estimatedPremium.replace(/[^\d\.]/g, '')) : undefined,
                assignedBrokerId: '',
                assignedBrokerName: '',
                score: 50,
                notes: row.notes || '',
                createdAt: now,
                updatedAt: now,
            };
        default:
            return {};
    }
}

/**
 * Converts parsed file data using column mappings into mapped row objects.
 */
export function applyMappings(
    data: string[][],
    mappings: ImportColumnMapping[]
): Record<string, string>[] {
    if (data.length <= 1) return [];

    const headerRow = data[0];
    const dataRows = data.slice(1);

    return dataRows.map(row => {
        const mapped: Record<string, string> = {};
        mappings.forEach(mapping => {
            if (mapping.targetField) {
                const colIndex = headerRow.indexOf(mapping.sourceColumn);
                if (colIndex >= 0 && colIndex < row.length) {
                    mapped[mapping.targetField] = row[colIndex];
                }
            }
        });
        return mapped;
    });
}

