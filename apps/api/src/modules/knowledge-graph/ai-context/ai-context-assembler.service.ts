import { Injectable } from '@nestjs/common';
import { ContextEngineService } from '../context/context-engine.service';
import { GraphQueryService } from '../graph/graph-query.service';

@Injectable()
export class AiContextAssemblerService {
  constructor(private readonly context: ContextEngineService, private readonly graph: GraphQueryService) {}
  async assembleForExecution(input: { workspaceId?: string; businessId?: string; userId?: string; focusEntityId?: string }) {
    const businessContext = await this.context.assemble(input);
    const entityNetwork = input.focusEntityId ? await this.graph.findConnectedEntities(input.focusEntityId) : [];
    return { relevantKpis: businessContext.kpis, relevantRevenue: businessContext.revenue, relevantCustomers: await this.graph.findCustomerRelationships(), relevantProjects: [], relevantEmployees: businessContext.departments, relevantWorkflows: businessContext.workflows, relevantGoals: businessContext.memories.filter((memory: any) => memory.memoryType === 'goal_history'), entityNetwork };
  }
}
