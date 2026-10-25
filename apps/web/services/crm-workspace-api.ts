import { apiRequest } from '@/lib/api-client';
import type { AiSalesCommandResult, CrmWorkspaceData, LeadRecord, OpportunityRecord, OpportunityStage, QuoteProposal } from '@/types/crm-workspace';

const base = '/v1/crm';

export type CreateCrmLeadPayload = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  role?: string;
  status?: LeadRecord['status'];
  score?: number;
  conversionProbability?: number;
  estimatedValue?: number;
  nextBestAction?: string;
  tags?: string[];
};

export const crmWorkspaceApi = {
  getWorkspace: () => apiRequest<CrmWorkspaceData>(base + '/workspace'),
  createLead: (payload: CreateCrmLeadPayload) => apiRequest<LeadRecord, CreateCrmLeadPayload>(base + '/leads', { method: 'POST', body: payload }),
  updateLead: (id: string, payload: Partial<CreateCrmLeadPayload>) => apiRequest<LeadRecord, Partial<CreateCrmLeadPayload>>(base + '/leads/' + id, { method: 'PATCH', body: payload }),
  moveOpportunity: (id: string, payload: { stage: OpportunityStage }) => apiRequest<OpportunityRecord, { stage: OpportunityStage }>(base + '/opportunities/' + id + '/stage', { method: 'PATCH', body: payload }),
  runSalesCommand: (payload: { command: string }) => apiRequest<AiSalesCommandResult, { command: string }>(base + '/ai-sales-copilot', { method: 'POST', body: payload }),
  exportProposalPdf: (proposalId: string) => apiRequest<{ proposalId: string; opportunityId: string; status: string }>(base + '/proposals/' + proposalId + '/export-pdf', { method: 'POST' }),
  requestProposalApproval: (proposal: QuoteProposal) => apiRequest<{ proposalId: string; opportunityId: string; status: string }>(base + '/proposals/' + proposal.id + '/approval', { method: 'POST' }),
};
