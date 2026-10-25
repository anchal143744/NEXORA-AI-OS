import { Injectable } from '@nestjs/common';
import { ConnectionManager } from './connection-manager.service';
import { IntegrationRepository } from './repositories/integration.repository';
import { TenantContextService } from '../tenants/tenant-context.service';
@Injectable()
export class IntegrationManager { constructor(private readonly context: TenantContextService, private readonly repo: IntegrationRepository, private readonly connections: ConnectionManager) {} list() { return this.repo.list(this.context.currentTenantId()); } validate(id: string) { return this.connections.validate(id); } revoke(id: string) { return this.connections.revoke(id); } rotate(id: string, credentials: Record<string, unknown>) { return this.connections.rotate(id, credentials); } }
