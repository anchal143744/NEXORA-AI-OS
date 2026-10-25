import { Injectable } from '@nestjs/common';
import { FoundationAgentKey } from '../contracts/agent.contract';
@Injectable()
export class AgentRouterService {
  route(objective: string): FoundationAgentKey { const text = objective.toLowerCase(); if (text.includes('lead') || text.includes('customer')) return 'crm'; if (text.includes('deal') || text.includes('sales')) return 'sales'; if (text.includes('invoice') || text.includes('cash') || text.includes('expense')) return 'finance'; if (text.includes('employee') || text.includes('hiring') || text.includes('attendance')) return 'hr'; if (text.includes('report') || text.includes('kpi') || text.includes('metric')) return 'analytics'; if (text.includes('retention') || text.includes('success')) return 'customer_success'; if (text.includes('strategy') || text.includes('executive')) return 'executive'; return 'operations'; }
}
