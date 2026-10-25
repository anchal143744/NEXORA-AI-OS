import { Injectable } from '@nestjs/common';
import { FoundationAgentKey } from './contracts/agent.contract';
import { AgentRouterService } from './router/agent-router.service';
import { AgentExecutionService } from './runtime/agent-execution.service';
@Injectable()
export class AgentRuntimeService { constructor(private readonly router: AgentRouterService, private readonly execution: AgentExecutionService) {} run(agentKey: FoundationAgentKey | undefined, objective: string, input: Record<string, unknown>) { return this.execution.enqueue({ agentKey: agentKey ?? this.router.route(objective), objective, payload: input }); } }
