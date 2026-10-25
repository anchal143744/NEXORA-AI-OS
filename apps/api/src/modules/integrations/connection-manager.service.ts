import { Injectable } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { ConnectorKey } from './connectors/connector.contracts';
import { IntegrationRegistry } from './connectors/integration-registry.service';
import { CredentialVault } from './credentials/credential-vault.service';
import { CreateIntegrationDto } from './dto/integration.dto';
import { IntegrationRepository } from './repositories/integration.repository';
@Injectable()
export class ConnectionManager { constructor(private readonly context: TenantContextService, private readonly registry: IntegrationRegistry, private readonly repo: IntegrationRepository, private readonly vault: CredentialVault, private readonly events: EventBusService) {}
  async connect(dto: CreateIntegrationDto) { const tenantId = this.context.currentTenantId(); const def = this.registry.get(dto.connectorKey); if (!def) throw new Error('Unsupported connector'); const provider = await this.repo.ensureProvider({ key: def.key, name: def.name, category: def.category, configSchema: { auth: def.auth, scopes: def.scopes } }); const encrypted = dto.credentials ? this.vault.encrypt(dto.credentials) : undefined; const secret = encrypted ? await this.repo.createSecret({ tenantId, kind: def.auth, encryptedValue: encrypted, fingerprint: this.vault.fingerprint(encrypted) }) : undefined; const integration = await this.repo.createIntegration({ tenantId, providerId: provider.id, name: dto.name, credentialsRef: secret?.id, settings: dto.settings }); if (secret) await this.repo.update(integration.id, { credentialsRef: secret.id }); await this.events.publish({ tenantId, type: 'connector.created', source: 'integration-engine', subject: { type: 'integration', id: integration.id }, payload: { connectorKey: dto.connectorKey } }); return integration; }
  async revoke(id: string) { const tenantId = this.context.currentTenantId(); const integration = await this.repo.get(tenantId, id); const updated = await this.repo.update(id, { status: 'REVOKED' }); await this.events.publish({ tenantId, type: 'connector.deleted', source: 'integration-engine', subject: { type: 'integration', id }, payload: { provider: integration.provider.key } }); return updated; }
  validate(id: string) { return this.repo.get(this.context.currentTenantId(), id).then(row => ({ id: row.id, status: row.status, valid: row.status === 'CONNECTED' })); }
  rotate(id: string, credentials: Record<string, unknown>) { const tenantId = this.context.currentTenantId(); const encrypted = this.vault.encrypt(credentials); return this.repo.createSecret({ tenantId, integrationId: id, kind: 'rotation', encryptedValue: encrypted, fingerprint: this.vault.fingerprint(encrypted) }).then((secret: any) => this.repo.update(id, { credentialsRef: secret.id, status: 'CONNECTED' })); }
}

