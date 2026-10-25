export type DiscoveryStepKey =
  | 'business'
  | 'industry'
  | 'team'
  | 'software'
  | 'goals'
  | 'intelligence'
  | 'preview'
  | 'generate';

export type DiscoveryAnswerMap = {
  businessModel: string;
  primaryOffer: string;
  industryHint: string;
  teamSize: string;
  departments: string[];
  currentSoftware: string[];
  operationalPain: string[];
  strategicGoals: string[];
  automationComfort: 'low' | 'medium' | 'high';
  dataMaturity: 'early' | 'developing' | 'advanced';
};

export type IndustryDetectionResult = {
  industry: string;
  confidence: number;
  signals: string[];
};

export type TeamIntelligenceResult = {
  sizeBand: string;
  operatingModel: string;
  recommendedRoles: string[];
  collaborationRisk: 'low' | 'medium' | 'high';
};

export type SoftwareDiscoveryResult = {
  detectedStack: string[];
  integrationPriorities: string[];
  replacementCandidates: string[];
};

export type AiBusinessProfile = {
  industry: IndustryDetectionResult;
  team: TeamIntelligenceResult;
  software: SoftwareDiscoveryResult;
  maturity: string;
  summary: string;
};

export type WorkspaceRecommendation = {
  label: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium';
};

export type WorkspaceBlueprintProfile = {
  industry: string;
  businessType: string;
  teamSize: string;
  revenueRange: string;
  growthStage: string;
  country: string;
  goals: string[];
  language?: string;
  currency?: string;
  timezone?: string;
  taxSystem?: string;
  accountingMethod?: string;
  departments?: string[];
  aiPreferences?: string[];
  expansionPlans?: string[];
};

export type WorkspaceBlueprint = {
  workspaceName: string;
  navigation: string[];
  modules: WorkspaceRecommendation[];
  kpis: WorkspaceRecommendation[];
  workflows: WorkspaceRecommendation[];
  agents: WorkspaceRecommendation[];
  automations: WorkspaceRecommendation[];
  profile?: WorkspaceBlueprintProfile;
};

export type AiReadinessScore = {
  score: number;
  level: 'Foundation' | 'Operational' | 'Intelligent' | 'Autonomous-ready';
  strengths: string[];
  gaps: string[];
};

export type WorkspaceGenerationResult = {
  blueprintId: string;
  organizationId?: string;
  workspaceId?: string;
  status: 'ready' | 'queued';
  workspaceName: string;
  generatedAt: string;
  persisted?: boolean;
};
