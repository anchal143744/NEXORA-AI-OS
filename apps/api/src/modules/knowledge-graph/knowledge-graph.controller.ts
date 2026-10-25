import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiContextAssemblerService } from './ai-context/ai-context-assembler.service';
import { ContextEngineService } from './context/context-engine.service';
import { ContextQueryDto, CreateBusinessMemoryDto, CreateOntologyEntityDto, CreateRelationshipDto, EnterpriseGraphSyncDto } from './dto/knowledge-graph.dto';
import { EnterpriseGraphSyncService } from './graph/enterprise-graph-sync.service';
import { GraphQueryService } from './graph/graph-query.service';
import { KnowledgeGraphService } from './graph/knowledge-graph.service';
import { BusinessMemoryService } from './memory/business-memory.service';
import { OntologyService } from './ontology/ontology.service';
import { RelationshipService } from './relationships/relationship.service';

@ApiTags('Business Ontology & Knowledge Graph')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'knowledge-graph', version: '1' })
export class KnowledgeGraphController {
  constructor(private readonly ontology: OntologyService, private readonly relationships: RelationshipService, private readonly graph: KnowledgeGraphService, private readonly enterpriseGraph: EnterpriseGraphSyncService, private readonly queries: GraphQueryService, private readonly context: ContextEngineService, private readonly memory: BusinessMemoryService, private readonly aiContext: AiContextAssemblerService) {}

  @Post('entities') createEntity(@Body() dto: CreateOntologyEntityDto) { return this.ontology.createEntity(dto); }
  @Get('entities') listEntities(@Query('entityType') entityType?: string) { return this.ontology.listEntities(entityType); }
  @Post('relationships') createRelationship(@Body() dto: CreateRelationshipDto) { return this.relationships.createRelationship(dto); }
  @Get('context-graph') getContextGraph(@Query('workspaceId') workspaceId?: string, @Query('businessId') businessId?: string) { return this.graph.contextGraph({ workspaceId, businessId }); }
  @Post('sync') syncEnterpriseGraph(@Body() dto: EnterpriseGraphSyncDto) { return this.enterpriseGraph.sync(dto); }
  @Get('enterprise') enterprise(@Query('workspaceId') workspaceId?: string, @Query('depth') depth?: string) { return this.enterpriseGraph.enterpriseGraph(workspaceId, depth ? Number(depth) : 2); }
  @Get('business-context') getBusinessContext(@Query() query: ContextQueryDto) { return this.context.assemble(query); }
  @Get('entity-network/:entityId') getEntityNetwork(@Param('entityId') entityId: string) { return this.queries.findConnectedEntities(entityId); }
  @Get('kpi-dependencies') getKpiDependencies() { return this.queries.findKpiDependencies(); }
  @Get('revenue-dependencies') getRevenueDependencies() { return this.queries.findRevenueDrivers(); }
  @Get('customer-relationships') getCustomerRelationships() { return this.queries.findCustomerRelationships(); }
  @Get('department-dependencies') getDepartmentDependencies() { return this.queries.findDepartmentDependencies(); }
  @Get('workflow-dependencies') getWorkflowDependencies() { return this.queries.findWorkflowDependencies(); }
  @Post('memory') storeMemory(@Body() dto: CreateBusinessMemoryDto) { return this.memory.store(dto); }
  @Get('memory') listMemory(@Query('memoryType') memoryType?: string) { return this.memory.list(memoryType); }
  @Get('ai-context') assembleAiContext(@Query() query: ContextQueryDto) { return this.aiContext.assembleForExecution({ workspaceId: query.workspaceId, businessId: query.businessId, focusEntityId: query.entityId }); }
}
