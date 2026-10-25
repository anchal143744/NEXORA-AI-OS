export type OnboardingStepKey =
  | 'welcome'
  | 'auth'
  | 'organization'
  | 'business'
  | 'ai'
  | 'workspace'
  | 'invite'
  | 'roles'
  | 'finish';

export type BusinessProfile = {
  organizationName: string;
  businessType: string;
  industry: string;
  country: string;
  revenueRange: string;
  teamSize: string;
  goals: string[];
};

export type AiSetupProfile = {
  copilotTone: 'executive' | 'operator' | 'analyst';
  enabledAgents: string[];
  automationLevel: 'recommend' | 'approval_required' | 'auto_low_risk';
};

export type WorkspaceGenerationRequest = {
  businessProfile: BusinessProfile;
  aiProfile: AiSetupProfile;
};

export type WorkspaceGenerationResult = {
  workspaceId: string;
  workspaceName: string;
  modules: string[];
  kpis: string[];
  workflows: string[];
  agents: string[];
};

export type InviteDraft = {
  email: string;
  role: string;
  team?: string;
};

export type RoleAssignmentDraft = {
  role: string;
  permissions: string[];
};
