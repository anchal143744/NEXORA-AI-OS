import type { ModuleKey, Permission, WorkspaceAiContext } from '@/types/workspace';

export type AiCopilotRole = 'user' | 'assistant' | 'system';
export type AiCopilotSource = 'backend' | 'workspace-context';
export type AiActionType = 'navigate' | 'workflow' | 'report' | 'automation' | 'assistant';

export interface AiCopilotMessage {
  id: string;
  role: AiCopilotRole;
  content: string;
  createdAt: string;
  source?: AiCopilotSource;
  actions?: AiCopilotAction[];
}

export interface AiCopilotAction {
  id: string;
  label: string;
  description: string;
  type: AiActionType;
  command: string;
  href?: string;
  moduleKey?: ModuleKey;
  requiredPermissions: Permission[];
  status: 'available' | 'restricted';
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  impact: string;
  moduleKey?: ModuleKey;
  action?: AiCopilotAction;
}

export interface ExecutiveBriefing {
  id: string;
  title: string;
  summary: string;
  healthScore: number | null;
  highlights: string[];
  risks: string[];
  opportunities: string[];
  generatedAt: string;
  source: AiCopilotSource;
}

export interface AiCopilotRequest {
  prompt: string;
  context: WorkspaceAiContext;
  history: AiCopilotMessage[];
}

export interface AiCopilotResponse {
  message: string;
  source: AiCopilotSource;
  actions: AiCopilotAction[];
  recommendations: AiRecommendation[];
  briefing?: ExecutiveBriefing;
}

export interface SmartCommandItem {
  id: string;
  label: string;
  description: string;
  type: 'navigation' | 'ai' | 'action';
  href?: string;
  prompt?: string;
  action?: AiCopilotAction;
}
