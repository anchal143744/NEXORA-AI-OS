import type { AiCopilotAction, SmartCommandItem } from '@/types/ai-copilot';
import type { WorkspaceAiContext } from '@/types/workspace';
import { canAccessWorkspaceResource } from '@/features/workspace/permission-engine';

type CommandDefinition = {
  id: string;
  label: string;
  description: string;
  patterns: string[];
  action: Omit<AiCopilotAction, 'status'>;
};

const commandDefinitions: CommandDefinition[] = [
  {
    id: 'create-crm-workflow',
    label: 'Create CRM workflow',
    description: 'Open workflow automation with CRM context for pipeline follow-up.',
    patterns: ['create crm workflow', 'crm workflow', 'lead workflow', 'opportunity workflow'],
    action: {
      id: 'action.create-crm-workflow',
      label: 'Open workflow builder',
      description: 'Start a CRM workflow draft from the existing workflow workspace.',
      type: 'workflow',
      command: 'create crm workflow',
      href: '/workspace/workflows?intent=crm-workflow',
      moduleKey: 'workflows',
      requiredPermissions: ['manage', 'execute'],
    },
  },
  {
    id: 'hire-employee',
    label: 'Hire employee',
    description: 'Open the People hiring workspace with AI guidance.',
    patterns: ['hire employee', 'create job', 'open hiring', 'recruit candidate'],
    action: {
      id: 'action.hire-employee',
      label: 'Open hiring workspace',
      description: 'Continue in the People hiring experience.',
      type: 'navigate',
      command: 'hire employee',
      href: '/people/hiring',
      moduleKey: 'hr',
      requiredPermissions: ['manage', 'create'],
    },
  },
  {
    id: 'generate-quarterly-report',
    label: 'Generate quarterly report',
    description: 'Open analytics reports with executive summary context.',
    patterns: ['generate quarterly report', 'quarterly report', 'executive report', 'board report'],
    action: {
      id: 'action.generate-quarterly-report',
      label: 'Open report builder',
      description: 'Generate a report from the analytics workspace.',
      type: 'report',
      command: 'generate quarterly report',
      href: '/analytics/reports?period=quarter',
      moduleKey: 'analytics',
      requiredPermissions: ['read'],
    },
  },
  {
    id: 'forecast-revenue',
    label: 'Forecast revenue',
    description: 'Open finance forecasting with revenue context.',
    patterns: ['forecast revenue', 'revenue forecast', 'next quarter revenue', 'cash forecast'],
    action: {
      id: 'action.forecast-revenue',
      label: 'Open finance forecasts',
      description: 'Use existing finance forecasting surfaces.',
      type: 'report',
      command: 'forecast revenue',
      href: '/finance/forecasts',
      moduleKey: 'finance',
      requiredPermissions: ['read'],
    },
  },
  {
    id: 'create-automation',
    label: 'Create automation',
    description: 'Open workflow automation with AI recommendations.',
    patterns: ['create automation', 'automate process', 'workflow automation', 'build automation'],
    action: {
      id: 'action.create-automation',
      label: 'Open automation center',
      description: 'Create an automation from existing workflow tooling.',
      type: 'automation',
      command: 'create automation',
      href: '/ai-agents/workflows',
      moduleKey: 'ai',
      requiredPermissions: ['execute', 'manage'],
    },
  },
];

export function resolveCopilotCommand(input: string, context: WorkspaceAiContext): SmartCommandItem | undefined {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return undefined;

  const definition = commandDefinitions.find((item) => item.patterns.some((pattern) => normalized.includes(pattern)));
  if (!definition) return undefined;

  const status = canAccessWorkspaceResource(context.permissions, definition.action.requiredPermissions) ? 'available' : 'restricted';
  const action: AiCopilotAction = { ...definition.action, status };

  return {
    id: definition.id,
    label: definition.label,
    description: definition.description,
    type: 'action',
    href: action.href,
    prompt: definition.action.command,
    action,
  };
}

export function getSuggestedCopilotPrompts(context: WorkspaceAiContext) {
  const prompts = ['Generate quarterly report', 'Forecast revenue', 'Create automation'];
  if (context.enabledModules.some((module) => module.key === 'crm')) prompts.unshift('Create CRM workflow');
  if (context.enabledModules.some((module) => module.key === 'hr')) prompts.push('Hire employee');
  return prompts;
}

export function getSmartCommandItems(context: WorkspaceAiContext): SmartCommandItem[] {
  const navigationItems = context.enabledModules.slice(0, 8).map((module) => ({
    id: 'nav.' + module.key,
    label: 'Open ' + module.label,
    description: 'Navigate to the ' + module.label + ' workspace.',
    type: 'navigation' as const,
    href: module.route,
  }));

  const aiCommands = getSuggestedCopilotPrompts(context).map((prompt) => {
    const resolved = resolveCopilotCommand(prompt, context);
    return resolved ?? {
      id: 'ai.' + prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: prompt,
      description: 'Ask the executive copilot to analyze this request.',
      type: 'ai' as const,
      prompt,
    };
  });

  return [...navigationItems, ...aiCommands];
}
