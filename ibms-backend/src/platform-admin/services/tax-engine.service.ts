import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Decimal } from '@prisma/client/runtime/library';

export interface TaxBreakdownItem {
  code: string;
  name: string;
  rate: number;
  amount: number;
  isCascading: boolean;
}

export interface TaxCalculationResult {
  basePremium: number;
  levies: TaxBreakdownItem[];
  totalLevies: number;
  cascadingTaxes: TaxBreakdownItem[];
  totalCascading: number;
  totalTax: number;
  grossPremium: number;
}

@Injectable()
export class TaxEngineService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch all active global tax rules for a given insurance type
   * and optional date (defaults to now).
   */
  async getActiveRules(insuranceType: string, asOfDate?: Date) {
    const date = asOfDate || new Date();

    const rules = await this.prisma.systemTaxRule.findMany({
      where: {
        tenantId: null, // Global rules only
        effectiveFrom: { lte: date },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: date } },
        ],
        applicableTo: { has: insuranceType as any },
      },
      orderBy: [
        { calculationOrder: 'asc' },
        { code: 'asc' },
      ],
    });

    return rules;
  }

  /**
   * Fetch all global tax rules (for admin panel display).
   */
  async getAllGlobalRules() {
    return this.prisma.systemTaxRule.findMany({
      where: { tenantId: null },
      orderBy: [
        { calculationOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  /**
   * Calculate the full tax breakdown for a given base premium.
   *
   * Logic:
   * 1. Apply all non-cascading levies (order 0) on the base premium.
   * 2. Apply cascading taxes (order 1+) on (basePremium + totalLevies).
   */
  async calculateTax(
    basePremium: number,
    insuranceType: string,
    asOfDate?: Date,
  ): Promise<TaxCalculationResult> {
    const rules = await this.getActiveRules(insuranceType, asOfDate);

    const levies: TaxBreakdownItem[] = [];
    const cascadingTaxes: TaxBreakdownItem[] = [];

    // Step 1: Non-cascading levies on base
    for (const rule of rules) {
      if (rule.isCascading) continue;

      const rate = new Decimal(rule.rate).toNumber();
      const amount =
        rule.type === 'FLAT_FEE'
          ? rate
          : Math.round(basePremium * rate * 100) / 100;

      levies.push({
        code: rule.code,
        name: rule.name,
        rate,
        amount,
        isCascading: false,
      });
    }

    const totalLevies = levies.reduce((sum, l) => sum + l.amount, 0);

    // Step 2: Cascading taxes on (base + levies)
    const cascadingBase = basePremium + totalLevies;

    for (const rule of rules) {
      if (!rule.isCascading) continue;

      const rate = new Decimal(rule.rate).toNumber();
      const amount =
        rule.type === 'FLAT_FEE'
          ? rate
          : Math.round(cascadingBase * rate * 100) / 100;

      cascadingTaxes.push({
        code: rule.code,
        name: rule.name,
        rate,
        amount,
        isCascading: true,
      });
    }

    const totalCascading = cascadingTaxes.reduce((sum, t) => sum + t.amount, 0);
    const totalTax = totalLevies + totalCascading;

    return {
      basePremium,
      levies,
      totalLevies,
      cascadingTaxes,
      totalCascading,
      totalTax,
      grossPremium: basePremium + totalTax,
    };
  }

  /**
   * Update a single tax rule by ID.
   */
  async updateRule(
    id: string,
    data: {
      name?: string;
      rate?: number;
      isCascading?: boolean;
      calculationOrder?: number;
      effectiveFrom?: Date;
      effectiveTo?: Date | null;
      applicableTo?: string[];
    },
  ) {
    return this.prisma.systemTaxRule.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.rate !== undefined && { rate: data.rate }),
        ...(data.isCascading !== undefined && { isCascading: data.isCascading }),
        ...(data.calculationOrder !== undefined && { calculationOrder: data.calculationOrder }),
        ...(data.effectiveFrom !== undefined && { effectiveFrom: data.effectiveFrom }),
        ...(data.effectiveTo !== undefined && { effectiveTo: data.effectiveTo }),
        ...(data.applicableTo !== undefined && { applicableTo: data.applicableTo as any }),
      },
    });
  }

  /**
   * Create a new tax rule.
   */
  async createRule(data: {
    name: string;
    code: string;
    rate: number;
    type?: string;
    isCascading?: boolean;
    calculationOrder?: number;
    effectiveFrom?: Date;
    effectiveTo?: Date | null;
    applicableTo?: string[];
    tenantId?: string | null;
  }) {
    return this.prisma.systemTaxRule.create({
      data: {
        name: data.name,
        code: data.code,
        rate: data.rate,
        type: data.type || 'PERCENTAGE',
        isCascading: data.isCascading || false,
        calculationOrder: data.calculationOrder || 0,
        effectiveFrom: data.effectiveFrom || new Date(),
        effectiveTo: data.effectiveTo || null,
        applicableTo: (data.applicableTo || []) as any,
        tenantId: data.tenantId || null,
      },
    });
  }
}
