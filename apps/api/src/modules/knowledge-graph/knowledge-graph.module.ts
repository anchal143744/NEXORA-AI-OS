import { Module } from '@nestjs/common';
import { TenantsModule } from '../tenants/tenants.module';
import { EventsModule } from '../events/events.module';
import { AiContextAssemblerService } from './ai-context/ai-context-assembler.service';
import { ContextEngineService } from './context/context-engine.service';
import { GraphQueryService } from './graph/graph-query.service';
import { KnowledgeGraphService } from './graph/knowledge-graph.service';
import { EnterpriseGraphSyncService } from './graph/enterprise-graph-sync.service';
import { KnowledgeGraphController } from './knowledge-graph.controller';
import { BusinessMemoryService } from './memory/business-memory.service';
import { OntologyService } from './ontology/ontology.service';
import { RelationshipService } from './relationships/relationship.service';

@Module({ imports: [TenantsModule, EventsModule], controllers: [KnowledgeGraphController], providers: [OntologyService, RelationshipService, KnowledgeGraphService, EnterpriseGraphSyncService, ContextEngineService, GraphQueryService, BusinessMemoryService, AiContextAssemblerService], exports: [OntologyService, RelationshipService, KnowledgeGraphService, EnterpriseGraphSyncService, ContextEngineService, GraphQueryService, BusinessMemoryService, AiContextAssemblerService] })
export class KnowledgeGraphModule {}
