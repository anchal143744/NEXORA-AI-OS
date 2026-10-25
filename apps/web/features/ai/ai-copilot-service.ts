import { apiRequest } from '@/lib/api-client';
import type { AiCopilotRequest, AiCopilotResponse, ExecutiveBriefing } from '@/types/ai-copilot';
import type { WorkspaceAiContext } from '@/types/workspace';

type BackendCopilotResponse = Partial<AiCopilotResponse> & {
  content?: string;
  response?: string;
  assistantMessage?: {
    content?: string;
  };
  conversationId?: string;
  contextId?: string;
};

type BackendInsight = {
  id?: string;
  title?: string;
  body?: string;
  severity?: string;
};

type BackendInsightResponse = {
  contextId?: string;
  insights?: BackendInsight[];
};

export async function sendCopilotPrompt(request: AiCopilotRequest): Promise<AiCopilotResponse> {
  const response = await apiRequest<BackendCopilotResponse, Record<string, unknown>>('/v1/ai/chat', {
    method: 'POST',
    body: toBackendChatRequest(request),
  });

  const message = response.message ?? response.assistantMessage?.content ?? response.content ?? response.response;
  if (!message) throw new Error('The AI copilot backend returned an empty response.');

  return {
    message,
    source: 'backend',
    actions: response.actions ?? [],
    recommendations: response.recommendations ?? [],
    briefing: response.briefing,
  };
}

export async function fetchExecutiveBriefing(context: WorkspaceAiContext): Promise<ExecutiveBriefing> {
  const response = await apiRequest<ExecutiveBriefing | BackendInsightResponse, Record<string, unknown>>('/v1/ai/insights', {
    method: 'POST',
    body: toBackendContextRequest(context),
  });

  if ('summary' in response && 'highlights' in response) return { ...response, source: 'backend' };

  const insights = response.insights ?? [];
  return {
    id: response.contextId ?? context.workspaceId,
    title: 'Executive AI briefing',
    summary: insights.length ? 'Backend AI generated authorized workspace insights.' : 'Backend AI returned no insights for this workspace yet.',
    healthScore: null,
    highlights: insights.map((insight) => insight.body ?? insight.title ?? 'Insight available').slice(0, 4),
    risks: insights.filter((insight) => insight.severity === 'HIGH' || insight.severity === 'CRITICAL').map((insight) => insight.body ?? insight.title ?? 'Risk insight').slice(0, 3),
    opportunities: insights.filter((insight) => insight.severity !== 'HIGH' && insight.severity !== 'CRITICAL').map((insight) => insight.body ?? insight.title ?? 'Opportunity insight').slice(0, 3),
    generatedAt: new Date().toISOString(),
    source: 'backend',
  };
}

function toBackendChatRequest(request: AiCopilotRequest) {
  return {
    ...toBackendContextRequest(request.context),
    message: request.prompt,
    copilotKey: request.context.currentModule ?? 'executive',
  };
}

function toBackendContextRequest(context: WorkspaceAiContext) {
  return {
    workspaceId: context.workspaceId,
    userRole: context.currentUser.role,
    countryCode: context.locale.split('-')[1] ?? context.locale,
  };
}
