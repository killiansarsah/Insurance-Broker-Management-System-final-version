import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { TaxEngineService } from '../services/tax-engine.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/tax-rules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN')
export class TaxRulesController {
  constructor(
    private readonly taxEngine: TaxEngineService,
    private readonly audit: PlatformAuditService,
  ) {}

  /** List all global tax rules */
  @Get()
  async listRules() {
    const rules = await this.taxEngine.getAllGlobalRules();
    return { data: rules };
  }

  /** Preview tax calculation for a given base premium and insurance type */
  @Get('preview')
  async previewCalculation(
    @Query('basePremium') basePremium: string,
    @Query('insuranceType') insuranceType: string,
  ) {
    const base = parseFloat(basePremium) || 0;
    const result = await this.taxEngine.calculateTax(base, insuranceType);
    return { data: result };
  }

  /** Update a specific tax rule */
  @Patch(':id')
  async updateRule(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      rate?: number;
      isCascading?: boolean;
      calculationOrder?: number;
      effectiveFrom?: string;
      effectiveTo?: string | null;
      applicableTo?: string[];
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const updateData: any = { ...body };
    if (body.effectiveFrom) updateData.effectiveFrom = new Date(body.effectiveFrom);
    if (body.effectiveTo) updateData.effectiveTo = new Date(body.effectiveTo);
    if (body.effectiveTo === null) updateData.effectiveTo = null;

    const updated = await this.taxEngine.updateRule(id, updateData);

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'TAX_RULE_UPDATED',
      description: `Tax rule "${updated.name}" (${updated.code}) updated`,
      metadata: { ruleId: id, changes: body },
    });

    return { data: updated };
  }

  /** Create a new tax rule */
  @Post()
  async createRule(
    @Body() body: {
      name: string;
      code: string;
      rate: number;
      type?: string;
      isCascading?: boolean;
      calculationOrder?: number;
      effectiveFrom?: string;
      effectiveTo?: string | null;
      applicableTo?: string[];
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const createData: any = { ...body };
    if (body.effectiveFrom) createData.effectiveFrom = new Date(body.effectiveFrom);
    if (body.effectiveTo) createData.effectiveTo = new Date(body.effectiveTo);

    const created = await this.taxEngine.createRule(createData);

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'TAX_RULE_CREATED',
      description: `New tax rule "${created.name}" (${created.code}) created`,
      metadata: { ruleId: created.id },
    });

    return { data: created };
  }
}
