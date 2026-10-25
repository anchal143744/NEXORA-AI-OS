import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CalculateTaxDto, CreateTaxCategoryDto, CreateTaxRegionDto, CreateTaxRuleDto } from '../dto/global-finance.dto';

@Injectable()
export class TaxEngineService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }

  createRegion(dto: CreateTaxRegionDto) {
    return this.prisma.taxRegion.create({ data: { tenantId: this.tenantId(), countryCode: dto.countryCode.toUpperCase(), regionCode: dto.regionCode, name: dto.name, regionType: dto.regionType ?? 'country', parentId: dto.parentId, metadata: dto.metadata ?? {} } });
  }

  listRegions(countryCode?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    return this.prisma.taxRegion.findMany({ where, orderBy: [{ countryCode: 'asc' }, { regionCode: 'asc' }] });
  }

  createCategory(dto: CreateTaxCategoryDto) {
    return this.prisma.taxCategory.upsert({
      where: { tenantId_code: { tenantId: this.tenantId(), code: dto.code } },
      update: { name: dto.name, description: dto.description, exempt: dto.exempt ?? false, metadata: dto.metadata ?? {} },
      create: { tenantId: this.tenantId(), code: dto.code, name: dto.name, description: dto.description, exempt: dto.exempt ?? false, metadata: dto.metadata ?? {} },
    });
  }

  listCategories() {
    return this.prisma.taxCategory.findMany({ where: { tenantId: this.tenantId(), deletedAt: null }, orderBy: { code: 'asc' } });
  }

  createRule(dto: CreateTaxRuleDto) {
    return this.prisma.taxRule.create({ data: { tenantId: this.tenantId(), countryCode: dto.countryCode.toUpperCase(), regionId: dto.regionId, taxCategoryId: dto.taxCategoryId, taxType: dto.taxType, name: dto.name, rate: dto.rate, inclusive: dto.inclusive ?? false, exemptionCode: dto.exemptionCode, exemptionReason: dto.exemptionReason, reverseCharge: dto.reverseCharge ?? false, corporateTaxMetadata: dto.corporateTaxMetadata ?? {}, version: dto.version ?? 1, effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date(), effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined, metadata: dto.metadata ?? {} } });
  }

  listRules(countryCode?: string, taxType?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    if (taxType) where.taxType = taxType;
    return this.prisma.taxRule.findMany({ where, include: { region: true, category: true }, orderBy: [{ countryCode: 'asc' }, { taxType: 'asc' }, { version: 'desc' }] });
  }

  async calculate(dto: CalculateTaxDto) {
    const tenantId = this.tenantId();
    const countryCode = dto.countryCode.toUpperCase();
    const category = dto.taxCategoryCode ? await this.prisma.taxCategory.findFirst({ where: { tenantId, code: dto.taxCategoryCode, deletedAt: null } }) : null;
    if (category?.exempt) {
      return { countryCode, currency: dto.currency, taxableAmount: dto.amount, taxTotal: 0, total: dto.amount, inclusive: Boolean(dto.inclusive), exempt: true, exemptionCode: dto.taxCategoryCode, breakdown: [] };
    }

    const now = new Date();
    const rules = await this.prisma.taxRule.findMany({ where: { tenantId, countryCode, status: 'active', deletedAt: null, OR: [{ taxCategoryId: category?.id }, { taxCategoryId: null }] }, include: { region: true, category: true }, orderBy: [{ version: 'desc' }, { effectiveFrom: 'desc' }] });
    const activeRules = rules.filter((rule: any) => (!dto.regionId || !rule.regionId || rule.regionId === dto.regionId) && new Date(rule.effectiveFrom) <= now && (!rule.effectiveTo || new Date(rule.effectiveTo) >= now));
    const inclusive = dto.inclusive ?? activeRules.some((rule: any) => rule.inclusive);
    const breakdown = activeRules.map((rule: any) => {
      const rate = Number(rule.rate);
      const taxableAmount = inclusive ? dto.amount / (1 + rate / 100) : dto.amount;
      const taxAmount = inclusive ? dto.amount - taxableAmount : taxableAmount * (rate / 100);
      return { taxRuleId: rule.id, taxType: rule.taxType, taxName: rule.name, rate, taxableAmount: Number(taxableAmount.toFixed(4)), taxAmount: Number(taxAmount.toFixed(4)), inclusive: inclusive || rule.inclusive, exemptionCode: rule.exemptionCode };
    });
    const taxTotal = breakdown.reduce((sum: number, row: any) => sum + row.taxAmount, 0);
    return { countryCode, currency: dto.currency, taxableAmount: dto.amount, taxTotal: Number(taxTotal.toFixed(4)), total: Number((inclusive ? dto.amount : dto.amount + taxTotal).toFixed(4)), inclusive, exempt: false, breakdown };
  }
}