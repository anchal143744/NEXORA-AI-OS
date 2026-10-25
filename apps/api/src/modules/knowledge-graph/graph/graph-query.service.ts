import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';

@Injectable()
export class GraphQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}
  findConnectedEntities(entityId: string) { const tenantId = this.context.currentTenantId(); return this.prisma.knowledgeEdge.findMany({ where: { tenantId, deletedAt: null, OR: [{ sourceEntityId: entityId }, { targetEntityId: entityId }] }, orderBy: { createdAt: 'desc' }, take: 200 }); }
  async findRevenueDrivers() { const tenantId = this.context.currentTenantId(); const revenue = await this.prisma.ontologyEntity.findMany({ where: { tenantId, entityType: { in: ['revenue','invoice','customer'] }, deletedAt: null } }); const ids = revenue.map((entity: any) => entity.id); return this.prisma.knowledgeEdge.findMany({ where: { tenantId, deletedAt: null, OR: [{ targetEntityId: { in: ids } }, { sourceEntityId: { in: ids } }], edgeType: { in: ['drives','generates','influences','depends_on'] } }, take: 250 }); }
  async findCustomerRelationships() { const tenantId = this.context.currentTenantId(); const customers = await this.prisma.ontologyEntity.findMany({ where: { tenantId, entityType: 'customer', deletedAt: null } }); return this.networkFor(customers.map((customer: any) => customer.id)); }
  async findKpiDependencies() { const tenantId = this.context.currentTenantId(); const kpis = await this.prisma.ontologyEntity.findMany({ where: { tenantId, entityType: 'kpi', deletedAt: null } }); return this.networkFor(kpis.map((kpi: any) => kpi.id)); }
  async findDepartmentDependencies() { const tenantId = this.context.currentTenantId(); const departments = await this.prisma.ontologyEntity.findMany({ where: { tenantId, entityType: 'department', deletedAt: null } }); return this.networkFor(departments.map((department: any) => department.id)); }
  async findWorkflowDependencies() { const tenantId = this.context.currentTenantId(); const workflows = await this.prisma.ontologyEntity.findMany({ where: { tenantId, entityType: 'workflow', deletedAt: null } }); return this.networkFor(workflows.map((workflow: any) => workflow.id)); }
  private networkFor(ids: string[]) { return this.prisma.knowledgeEdge.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null, OR: [{ sourceEntityId: { in: ids } }, { targetEntityId: { in: ids } }] }, orderBy: { createdAt: 'desc' }, take: 300 }); }
}
