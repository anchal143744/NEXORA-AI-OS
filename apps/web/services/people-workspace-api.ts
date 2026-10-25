import { apiRequest } from '@/lib/api-client';
import type { AiHrCommandResult, CandidateRecord, CandidateStage, LeaveRequest, PeopleWorkspaceData } from '@/types/people-workspace';

const base = '/v1/hr';

export const peopleWorkspaceApi = {
  getWorkspace: () => apiRequest<PeopleWorkspaceData>(base + '/workspace'),
  checkIn: (employeeId: string) => apiRequest<{ employeeId: string; status: string }>(base + '/attendance/' + employeeId + '/check-in', { method: 'POST' }),
  checkOut: (employeeId: string) => apiRequest<{ employeeId: string; status: string }>(base + '/attendance/' + employeeId + '/check-out', { method: 'POST' }),
  approveLeave: (leaveRequest: LeaveRequest) => apiRequest<LeaveRequest, LeaveRequest>(base + '/leave/' + leaveRequest.id + '/approve', { method: 'POST', body: leaveRequest }),
  moveCandidate: (candidateId: string, payload: { stage: CandidateStage }) => apiRequest<CandidateRecord, { stage: CandidateStage }>(base + '/candidates/' + candidateId + '/stage', { method: 'PATCH', body: payload }),
  runHrCommand: (payload: { command: string }) => apiRequest<AiHrCommandResult, { command: string }>(base + '/ai-hr-copilot', { method: 'POST', body: payload }),
};
