import { apiRequest, getStoredAuthSession } from '@/lib/api-client';
import { buildAiBusinessProfile, calculateAiReadinessScore, generateWorkspaceBlueprint } from '@/lib/workspace-intelligence';
import type { AiReadinessScore, DiscoveryAnswerMap, WorkspaceBlueprint, WorkspaceGenerationResult } from '@/types/discovery';

const base = '/v1/workspaces';

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
  generatedAt?: string;
  createdAt?: string;
};

export const workspaceIntelligenceApi = {
  profileBusiness: async (payload: DiscoveryAnswerMap) => buildAiBusinessProfile(payload),
  generateBlueprint: async (payload: DiscoveryAnswerMap) => generateWorkspaceBlueprint(payload),
  scoreReadiness: async (payload: { answers: DiscoveryAnswerMap; blueprint: WorkspaceBlueprint }): Promise<AiReadinessScore> =>
    calculateAiReadinessScore(payload.answers, payload.blueprint),
  generateWorkspace: async (payload: WorkspaceBlueprint) => {
    const stored = getStoredAuthSession();

    const organizationId = stored.session?.organizationId ?? stored.user?.organizationId;
    if (!organizationId) throw new Error('Organization context is required before workspace generation.');

    const workspaceSlug = payload.workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nexora-workspace';
    const profile = payload.profile;
    const response = await apiRequest<WorkspaceGenerationApiResponse, Record<string, unknown>>(base + '/generate', {
      method: 'POST',
      body: {
        organizationId,
        workspaceName: payload.workspaceName,
        workspaceSlug,
        profile: {
          industry: profile?.industry ?? inferIndustry(payload.workspaceName),
          businessType: profile?.businessType ?? 'enterprise',
          teamSize: profile?.teamSize ?? '51_200',
          revenueRange: profile?.revenueRange ?? '1m_10m',
          growthStage: profile?.growthStage ?? 'growth',
          country: profile?.country ?? 'US',
          goals: profile?.goals ?? payload.kpis.map((item) => item.label),
          role: 'Admin',
          metadata: {
            source: 'phase_3_ai_business_setup',
            modules: payload.modules.map((item) => item.label),
            navigation: payload.navigation,
            kpis: payload.kpis.map((item) => item.label),
            workflows: payload.workflows.map((item) => item.label),
            agents: payload.agents.map((item) => item.label),
            automations: payload.automations.map((item) => item.label),
            language: profile?.language,
            currency: profile?.currency,
            timezone: profile?.timezone,
            taxSystem: profile?.taxSystem,
            accountingMethod: profile?.accountingMethod,
            departments: profile?.departments,
            aiPreferences: profile?.aiPreferences,
            expansionPlans: profile?.expansionPlans,
          },
        },
      },
    });

    const generatedOrganizationId = response?.organizationId ?? response?.workspace?.organizationId ?? organizationId;
    const generatedWorkspaceId = response?.workspaceId ?? response?.workspace?.id;
    const blueprintId = response?.blueprintId ?? response?.id;
    const generatedAt = response?.generatedAt ?? response?.createdAt;
    if (!generatedWorkspaceId) {
      throw new Error('Workspace generation completed but did not return a workspace ID.');
    }
    if (!blueprintId) {
      throw new Error('Workspace generation completed but did not return a blueprint ID.');
    }
    if (!generatedAt) {
      throw new Error('Workspace generation completed but did not return a generation timestamp.');
    }

    const result = {
      blueprintId,
      organizationId: generatedOrganizationId,
      workspaceId: generatedWorkspaceId,
      status: 'ready',
      workspaceName: response?.workspace?.name ?? payload.workspaceName,
      generatedAt,
      persisted: true,
    } satisfies WorkspaceGenerationResult;

    persistGeneratedWorkspaceContext({ organizationId: generatedOrganizationId, workspaceId: generatedWorkspaceId });
    return result;
  },
};

function persistGeneratedWorkspaceContext(context: { organizationId?: string; workspaceId?: string }) {
  if (typeof window === 'undefined') return;
  if (!context.organizationId && !context.workspaceId) return;
  try {
    const raw = window.localStorage.getItem('nexora.auth.session');
    const stored = raw ? parseStoredAuthRecord(raw) : {};
    const user = normalizeStoredRecord(stored.user);
    const session = normalizeStoredRecord(stored.session);
    if (context.organizationId) {
      user.organizationId = context.organizationId;
      session.organizationId = context.organizationId;
    }
    if (context.workspaceId) {
      user.workspaceId = context.workspaceId;
      session.workspaceId = context.workspaceId;
    }
    window.localStorage.setItem('nexora.auth.session', JSON.stringify({ ...stored, user, session }));
  } catch {
    /* Storage synchronization is best-effort. The API response still carries the context. */
  }
}

function inferIndustry(workspaceName: string) {
  const known = ['saas', 'agency', 'ecommerce', 'retail', 'healthcare', 'manufacturing', 'education', 'finance', 'logistics', 'consulting'];
  const normalized = workspaceName.toLowerCase();
  return known.find((industry) => normalized.includes(industry)) ?? 'saas';
}

function parseStoredAuthRecord(raw: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(raw);
  return isRecord(parsed) ? parsed : {};
}

function normalizeStoredRecord(value: unknown): Record<string, unknown> & { organizationId?: string; workspaceId?: string } {
  return isRecord(value) ? { ...value } : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
