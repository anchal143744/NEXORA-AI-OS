import { apiRequest, getStoredAuthSession } from '@/lib/api-client';
import type { BusinessProfile, InviteDraft, RoleAssignmentDraft, WorkspaceGenerationRequest, WorkspaceGenerationResult } from '@/types/onboarding';

type BusinessRecordResponse = {
  id: string;
};

type BusinessRecordRequest = {
  organizationId: string;
  name: string;
  businessType: string;
  industry: string;
  countryCode?: string;
  goals?: string[];
};

type BlueprintItem = {
  title?: string;
  label?: string;
  key?: string;
  moduleKey?: string;
};

type WorkspaceBlueprintDocument = {
  modules?: BlueprintItem[];
  kpis?: BlueprintItem[];
  workflows?: BlueprintItem[];
  aiAgents?: BlueprintItem[];
};

type WorkspaceGenerationApiResponse = {
  id?: string;
  blueprintId?: string;
  organizationId?: string;
  workspaceId?: string;
  workspace?: {
    id?: string;
    organizationId?: string;
    name?: string;
    slug?: string;
  };
  blueprint?: WorkspaceBlueprintDocument | null;
  generatedAt?: string;
  createdAt?: string;
};

export const onboardingApi = {
  createOrganization: (payload: Pick<BusinessProfile, 'organizationName' | 'country'>) =>
    apiRequest<{ id: string; organizationId?: string }, { name: string; countryCode?: string }>('/v1/tenants/organizations', {
      method: 'POST',
      body: { name: payload.organizationName, countryCode: payload.country },
    }),
  saveBusinessProfile: async (payload: BusinessProfile) => {
    const organizationId = getOrganizationId();
    const response = await apiRequest<BusinessRecordResponse, BusinessRecordRequest>('/v1/tenants/businesses', {
      method: 'POST',
      body: {
        organizationId,
        name: payload.organizationName,
        businessType: normalizeBusinessType(payload.businessType),
        industry: normalizeIndustry(payload.industry),
        countryCode: normalizeCountryCode(payload.country),
        goals: payload.goals,
      },
    });
    if (!response.id) throw new Error('Business profile was saved but the API did not return a business ID.');
    return { businessId: response.id, saved: true };
  },
  generateWorkspace: async (payload: WorkspaceGenerationRequest) => {
    const organizationId = getOrganizationId();
    const workspaceName = payload.businessProfile.organizationName + ' Operating Workspace';
    const workspaceSlug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nexora-workspace';
    const response = await apiRequest<WorkspaceGenerationApiResponse, Record<string, unknown>>('/v1/workspaces/generate', {
      method: 'POST',
      body: {
        organizationId,
        workspaceName,
        workspaceSlug,
        profile: {
          industry: normalizeIndustry(payload.businessProfile.industry),
          businessType: normalizeBusinessType(payload.businessProfile.businessType),
          teamSize: normalizeTeamSize(payload.businessProfile.teamSize),
          revenueRange: normalizeRevenue(payload.businessProfile.revenueRange),
          growthStage: 'growth',
          country: payload.businessProfile.country || 'US',
          goals: payload.businessProfile.goals,
          role: 'Admin',
          metadata: { automationLevel: payload.aiProfile.automationLevel, enabledAgents: payload.aiProfile.enabledAgents },
        },
      },
    });
    const generatedWorkspaceId = response.workspaceId ?? response.workspace?.id;
    if (!generatedWorkspaceId) {
      throw new Error('Workspace generation completed but the API did not return a workspace ID.');
    }
    const blueprint = response.blueprint;
    return {
      workspaceId: generatedWorkspaceId,
      workspaceName: response.workspace?.name ?? workspaceName,
      modules: extractLabels(blueprint?.modules),
      kpis: extractLabels(blueprint?.kpis),
      workflows: extractLabels(blueprint?.workflows),
      agents: extractLabels(blueprint?.aiAgents),
    } satisfies WorkspaceGenerationResult;
  },
  sendInvite: (payload: InviteDraft) =>
    apiRequest<{ inviteId: string; sent: boolean }, InviteDraft>('/v1/invites', { method: 'POST', body: payload }),
  assignRole: (payload: RoleAssignmentDraft) =>
    apiRequest<{ assigned: boolean }, RoleAssignmentDraft>('/v1/rbac/assign-role', { method: 'POST', body: payload }),
  progress: async () => ({ completedSteps: [], currentStep: 'organization' }),
};

function getOrganizationId() {
  const stored = getStoredAuthSession();
  const organizationId = stored.session?.organizationId ?? stored.user?.organizationId;
  if (!organizationId) throw new Error('Organization context is required. Sign in with an organization-backed account before continuing.');
  return organizationId;
}

function normalizeIndustry(value: string) {
  const normalized = value.toLowerCase();
  const allowed = ['saas', 'agency', 'ecommerce', 'retail', 'healthcare', 'manufacturing', 'education', 'finance', 'logistics', 'consulting'];
  return allowed.includes(normalized) ? normalized : 'saas';
}

function normalizeBusinessType(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, '_');
  const allowed = ['startup', 'small_business', 'agency', 'ecommerce', 'manufacturing', 'enterprise', 'global_organization'];
  return allowed.includes(normalized) ? normalized : 'enterprise';
}

function normalizeTeamSize(value: string) {
  if (value.includes('201') || value.includes('1000')) return '201_1000';
  if (value.includes('51')) return '51_200';
  if (value.includes('11')) return '11_50';
  if (value.includes('1-10') || value.includes('2')) return '2_10';
  return '51_200';
}

function normalizeRevenue(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('100m')) return '100m_plus';
  if (normalized.includes('10m')) return '10m_100m';
  if (normalized.includes('1m')) return '1m_10m';
  if (normalized.includes('100k')) return '100k_1m';
  if (normalized.includes('pre')) return 'pre_revenue';
  return '1m_10m';
}

function normalizeCountryCode(value: string) {
  const normalized = value.trim().toLowerCase();
  const known: Record<string, string> = {
    us: 'US',
    usa: 'US',
    'united states': 'US',
    india: 'IN',
    in: 'IN',
    'united kingdom': 'GB',
    uk: 'GB',
    gb: 'GB',
    'united arab emirates': 'AE',
    uae: 'AE',
    ae: 'AE',
  };
  return known[normalized] ?? undefined;
}

function extractLabels(items?: BlueprintItem[]) {
  return (items ?? [])
    .map((item) => item.title ?? item.label ?? item.moduleKey ?? item.key)
    .filter((value): value is string => Boolean(value));
}
