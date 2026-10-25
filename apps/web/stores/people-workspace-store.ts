'use client';

import { create } from 'zustand';
import type { AiHrCommandResult, CandidateStage, EmployeeStatus, LeaveStatus, PeopleWorkspaceData } from '@/types/people-workspace';

type PeopleWorkspaceState = PeopleWorkspaceData & {
  employeeStatusFilter: EmployeeStatus | 'all';
  leaveStatusFilter: LeaveStatus | 'all';
  selectedCandidateStage: CandidateStage | 'all';
  searchQuery: string;
  commands: AiHrCommandResult[];
  setSearchQuery: (query: string) => void;
  setEmployeeStatusFilter: (status: EmployeeStatus | 'all') => void;
  setLeaveStatusFilter: (status: LeaveStatus | 'all') => void;
  setSelectedCandidateStage: (stage: CandidateStage | 'all') => void;
  hydrateWorkspace: (data: PeopleWorkspaceData) => void;
  moveCandidate: (candidateId: string, stage: CandidateStage) => void;
  approveLeave: (leaveId: string) => void;
  addCommand: (command: AiHrCommandResult) => void;
};

const initial: PeopleWorkspaceData = {
  metrics: [],
  employees: [],
  attendance: [],
  leaveRequests: [],
  leaveBalances: [],
  jobs: [],
  candidates: [],
  reviews: [],
  goals: [],
  learning: [],
  orgNodes: [],
  workforceMetrics: [],
  insights: [],
};

export const usePeopleWorkspaceStore = create<PeopleWorkspaceState>((set) => ({
  ...initial,
  employeeStatusFilter: 'all',
  leaveStatusFilter: 'all',
  selectedCandidateStage: 'all',
  searchQuery: '',
  commands: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setEmployeeStatusFilter: (employeeStatusFilter) => set({ employeeStatusFilter }),
  setLeaveStatusFilter: (leaveStatusFilter) => set({ leaveStatusFilter }),
  setSelectedCandidateStage: (selectedCandidateStage) => set({ selectedCandidateStage }),
  hydrateWorkspace: (data) => set({ ...data }),
  moveCandidate: (candidateId, stage) => set((state) => ({ candidates: state.candidates.map((candidate) => (candidate.id === candidateId ? { ...candidate, stage } : candidate)) })),
  approveLeave: (leaveId) =>
    set((state) => {
      const leaveRequests = state.leaveRequests.map((leave) => (leave.id === leaveId ? { ...leave, status: 'approved' as const } : leave));
      return { leaveRequests };
    }),
  addCommand: (command) => set((state) => ({ commands: [command, ...state.commands].slice(0, 6) })),
}));
