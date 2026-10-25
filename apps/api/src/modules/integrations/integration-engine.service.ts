import { Injectable } from '@nestjs/common';
import { ConnectionManager } from './connection-manager.service';
import { ConnectorExecution } from './connectors/connector.contracts';
import { IntegrationRegistry } from './connectors/integration-registry.service';
import { ConnectorRuntime } from './connectors/connector-runtime.service';
import { CreateIntegrationDto } from './dto/integration.dto';
@Injectable()
export class IntegrationEngine { constructor(private readonly registry: IntegrationRegistry, private readonly connections: ConnectionManager, private readonly runtime: ConnectorRuntime) {} registrySnapshot() { return { connectors: this.registry.list() }; } connect(dto: CreateIntegrationDto) { return this.connections.connect(dto); } execute(input: ConnectorExecution) { return this.runtime.execute(input); } }
