import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { COMPLIANCE_FRAMEWORK_KEYS, ComplianceRuleQueryDto } from '../dto/localization.dto';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  async getFrameworks() {
    const tenantId = this.context.currentTenantId();
    const frameworks = await this.prisma.complianceFramework.findMany({ where: { tenantId, deletedAt: null }, orderBy: { key: 'asc' } });
    if (frameworks.length) return frameworks;
    return COMPLIANCE_FRAMEWORK_KEYS.map((key) => ({ key, name: key, tenantId, requirements: [] }));
  }

  async getRules(query: ComplianceRuleQueryDto) {
    const tenantId = this.context.currentTenantId();
    const where: any = { tenantId, deletedAt: null };
    if (query.frameworkKey) where.framework = { key: query.frameworkKey };
    if (query.countryCode) where.countryCode = query.countryCode.toUpperCase();
    return this.prisma.complianceRule.findMany({ where, include: { framework: true }, orderBy: { ruleKey: 'asc' } });
  }

  async getControls(frameworkKey?: string) {
    const tenantId = this.context.currentTenantId();
    const where: any = { tenantId, deletedAt: null };
    if (frameworkKey) where.framework = { key: frameworkKey };
    return this.prisma.complianceControl.findMany({ where, include: { framework: true }, orderBy: { key: 'asc' } });
  }

  async getDataPolicies(countryCode?: string) {
    const tenantId = this.context.currentTenantId();
    const where: any = { tenantId, deletedAt: null };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    const [dataPolicies, retentionPolicies, privacyControls] = await Promise.all([
      this.prisma.dataPolicy.findMany({ where, orderBy: { policyKey: 'asc' } }),
      this.prisma.retentionPolicy.findMany({ where, orderBy: { resourceType: 'asc' } }),
      this.prisma.privacyControl.findMany({ where, orderBy: { controlKey: 'asc' } }),
    ]);
    return { dataPolicies, retentionPolicies, privacyControls };
  }
}