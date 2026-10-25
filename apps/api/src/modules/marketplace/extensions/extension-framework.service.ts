import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateExtensionDefinitionDto, CreateExtensionHookDto, CreateExtensionPointDto } from '../dto/marketplace.dto';

@Injectable()
export class ExtensionFrameworkService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  sdk() {
    return {
      sdkVersion: '1.0.0',
      runtimes: ['server', 'client', 'edge', 'worker'],
      hookTypes: ['event', 'workflow', 'module', 'api'],
      extensionPointTypes: ['ui', 'api', 'workflow', 'module'],
      hookContracts: {
        event: { receives: ['tenantId', 'workspaceId', 'eventType', 'subject', 'payload'], returns: ['acknowledged', 'retryAfter'] },
        workflow: { receives: ['workflowId', 'executionId', 'nodeId', 'state'], returns: ['statePatch', 'nextAction'] },
        api: { receives: ['route', 'method', 'headers', 'body'], returns: ['responsePatch', 'policyDecision'] },
      },
      extensionPoints: ['shell.sidebar', 'shell.command-palette', 'workflow.node-library', 'record.detail.actions', 'admin.operations.panel'],
      security: { isolation: 'tenant-workspace', permissions: 'least-privilege', reviewRequiredFor: ['high', 'critical'] },
    };
  }

  definitions(type?: string) {
    return this.prisma.extensionDefinition.findMany({ where: { tenantId: this.context.currentTenantId(), extensionType: type ?? undefined, deletedAt: null }, include: { app: true, hooks: { where: { deletedAt: null } }, extensionPoints: { where: { deletedAt: null } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createDefinition(dto: CreateExtensionDefinitionDto) {
    const tenantId = this.context.currentTenantId();
    if (dto.appId) await this.requireApp(dto.appId);
    return this.prisma.extensionDefinition.create({ data: { tenantId, appId: dto.appId, extensionKey: dto.extensionKey, name: dto.name, extensionType: dto.extensionType, moduleKey: dto.moduleKey, status: dto.status ?? 'active', runtime: dto.runtime ?? 'server', entrypoint: dto.entrypoint, version: dto.version ?? '1.0.0', permissionScopes: dto.permissionScopes ?? [], configurationSchema: dto.configurationSchema ?? {}, metadata: dto.metadata ?? {} }, include: { app: true } });
  }

  hooks(hookType?: string) {
    return this.prisma.extensionHook.findMany({ where: { tenantId: this.context.currentTenantId(), hookType: hookType ?? undefined, deletedAt: null }, include: { extension: true }, orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }], take: 150 });
  }

  async registerHook(extensionId: string, dto: CreateExtensionHookDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireDefinition(extensionId);
    const hook = await this.prisma.extensionHook.create({ data: { tenantId, extensionId, hookType: dto.hookType, hookKey: dto.hookKey, target: dto.target, priority: dto.priority ?? 100, enabled: dto.enabled ?? true, retryPolicy: dto.retryPolicy ?? {}, filter: dto.filter ?? {}, handlerConfig: dto.handlerConfig ?? {}, metadata: dto.metadata ?? {} }, include: { extension: true } });
    await this.events.publish({ tenantId, workspaceId: this.context.currentWorkspaceId(), type: 'extension.hook.registered', source: 'extension-framework', subject: { type: 'extension_hook', id: hook.id }, payload: { hookType: hook.hookType, hookKey: hook.hookKey, target: hook.target, extensionId }, actorUserId: this.context.context()?.userId });
    return hook;
  }

  extensionPoints(pointType?: string) {
    return this.prisma.extensionPoint.findMany({ where: { tenantId: this.context.currentTenantId(), pointType: pointType ?? undefined, deletedAt: null }, include: { extension: true }, orderBy: { createdAt: 'desc' }, take: 150 });
  }

  async registerExtensionPoint(extensionId: string, dto: CreateExtensionPointDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireDefinition(extensionId);
    return this.prisma.extensionPoint.create({ data: { tenantId, extensionId, pointKey: dto.pointKey, pointType: dto.pointType, location: dto.location, moduleKey: dto.moduleKey, contract: dto.contract ?? {}, schema: dto.schema ?? {}, enabled: dto.enabled ?? true, metadata: dto.metadata ?? {} }, include: { extension: true } });
  }

  private async requireDefinition(id: string) {
    const definition = await this.prisma.extensionDefinition.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!definition) throw new NotFoundException('Extension definition not found');
    return definition;
  }

  private async requireApp(id: string) {
    const app = await this.prisma.marketplaceApp.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!app) throw new NotFoundException('Marketplace app not found');
    return app;
  }
}