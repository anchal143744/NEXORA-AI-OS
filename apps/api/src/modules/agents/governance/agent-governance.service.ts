import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AGENT_CAPABILITIES, CreateAgentCapabilityDto, CreateAgentRoleDto, FOUNDATION_AI_AGENTS, RegisterAgentDto } from '../dto/agent-execution.dto';
import { AgentAuditTrailService } from '../audit/agent-audit-trail.service';

@Injectable()
export class AgentGovernanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: AgentAuditTrailService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }

  listAgents() { return this.prisma.aiAgent.findMany({ where: { tenantId: this.tenantId(), deletedAt: null }, orderBy: { agentKey: 'asc' } }); }
  listRoles() { return this.prisma.aiAgentRole.findMany({ where: { tenantId: this.tenantId(), deletedAt: null }, orderBy: { roleKey: 'asc' } }); }
  listCapabilities() { return this.prisma.aiAgentCapability.findMany({ where: { tenantId: this.tenantId(), deletedAt: null }, orderBy: { capabilityKey: 'asc' } }); }

  async registerAgent(dto: RegisterAgentDto) {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId();
    const row = await this.prisma.aiAgent.upsert({ where: { tenantId_workspaceId_agentKey: { tenantId, workspaceId, agentKey: dto.agentKey } }, update: { name: dto.name, agentType: dto.agentType, roleId: dto.roleId, capabilities: dto.capabilities ?? [], riskPolicy: dto.riskPolicy ?? {}, configuration: dto.configuration ?? {} }, create: { tenantId, workspaceId, agentKey: dto.agentKey, name: dto.name, agentType: dto.agentType, roleId: dto.roleId, capabilities: dto.capabilities ?? [], riskPolicy: dto.riskPolicy ?? {}, configuration: dto.configuration ?? {} } });
    await this.audit.record({ agentId: row.id, action: 'ai.agent.registered', metadata: { agentKey: dto.agentKey } });
    return row;
  }

  async createRole(dto: CreateAgentRoleDto) {
    return this.prisma.aiAgentRole.upsert({ where: { tenantId_roleKey: { tenantId: this.tenantId(), roleKey: dto.roleKey } }, update: { name: dto.name, description: dto.description, approvalPolicy: dto.approvalPolicy ?? {}, permissions: dto.permissions ?? [] }, create: { tenantId: this.tenantId(), roleKey: dto.roleKey, name: dto.name, description: dto.description, approvalPolicy: dto.approvalPolicy ?? {}, permissions: dto.permissions ?? [] } });
  }

  async createCapability(dto: CreateAgentCapabilityDto) {
    return this.prisma.aiAgentCapability.upsert({ where: { tenantId_capabilityKey: { tenantId: this.tenantId(), capabilityKey: dto.capabilityKey } }, update: { name: dto.name, description: dto.description, riskLevel: dto.riskLevel, requiresApproval: dto.requiresApproval ?? dto.riskLevel !== 'low', allowedActions: dto.allowedActions ?? [], policy: dto.policy ?? {} }, create: { tenantId: this.tenantId(), capabilityKey: dto.capabilityKey, name: dto.name, description: dto.description, riskLevel: dto.riskLevel, requiresApproval: dto.requiresApproval ?? dto.riskLevel !== 'low', allowedActions: dto.allowedActions ?? [], policy: dto.policy ?? {} } });
  }

  async bootstrapFoundationAgents() {
    const role = await this.createRole({ roleKey: 'autonomous_agent', name: 'Autonomous AI Agent', approvalPolicy: { low: 'auto_execute', medium: 'manager_approval', high: 'executive_approval', critical: 'multi_step_approval' }, permissions: [...AGENT_CAPABILITIES] });
    const capabilities = [];
    for (const capabilityKey of AGENT_CAPABILITIES) capabilities.push(await this.createCapability({ capabilityKey, name: this.label(capabilityKey), riskLevel: this.defaultRisk(capabilityKey), allowedActions: [capabilityKey] }));
    const agents = [];
    for (const agentKey of FOUNDATION_AI_AGENTS) agents.push(await this.registerAgent({ agentKey, name: this.label(agentKey), agentType: agentKey.replace('_agent', ''), roleId: role.id, capabilities: [...AGENT_CAPABILITIES], riskPolicy: { low: 'auto_execute', medium: 'manager_approval', high: 'executive_approval', critical: 'multi_step_approval' } }));
    return { role, capabilities, agents };
  }

  private defaultRisk(capabilityKey: string) { return ['create_invoice','execute_workflow','trigger_automation'].includes(capabilityKey) ? 'high' : ['create_crm_record','create_workflow','send_notification'].includes(capabilityKey) ? 'medium' : 'low'; }
  private label(value: string) { return value.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
}