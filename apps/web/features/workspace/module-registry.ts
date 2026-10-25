import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  FileText,
  GitBranch,
  Globe2,
  HandCoins,
  Megaphone,
  Network,
  Package,
  Rocket,
  ServerCog,
  Settings2,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react';
import type { Industry, ModuleKey, WorkspaceModuleConfig } from '@/types/workspace';

export const registeredWorkspaceModules: WorkspaceModuleConfig[] = [
  createModule('crm', 'CRM', '/crm', 'operate', 10, ['read', 'create', 'update'], BriefcaseBusiness, ['widget.crm.pipeline', 'widget.crm.activity', 'widget.ai.sales'], 'Revenue operations, leads, accounts, contacts and opportunities.', ['agency', 'commerce', 'enterprise', 'saas', 'retail', 'consulting']),
  createModule('finance', 'Finance', '/finance', 'operate', 20, ['read', 'approve', 'manage'], HandCoins, ['widget.finance.revenue', 'widget.finance.cash', 'widget.finance.alerts'], 'Billing, invoices, payments, budgets and financial intelligence.', ['agency', 'commerce', 'enterprise', 'finance', 'manufacturing', 'retail', 'saas']),
  createModule('hr', 'People', '/people', 'operate', 30, ['read', 'manage'], Users, ['widget.hr.workforce', 'widget.hr.calendar', 'widget.ai.hr'], 'Employees, hiring, attendance, leave, performance and learning.', ['enterprise', 'healthcare', 'manufacturing', 'education', 'consulting', 'saas']),
  createModule('inventory', 'Inventory', '/workspace/inventory', 'operate', 40, ['read', 'update'], Package, ['widget.inventory.stock', 'widget.inventory.activity', 'widget.inventory.replenishment'], 'Stock, warehouses, movement history and replenishment planning.', ['commerce', 'ecommerce', 'manufacturing', 'retail', 'logistics']),
  createModule('projects', 'Projects', '/projects', 'operate', 50, ['read', 'create', 'update'], Network, ['widget.projects.tasks', 'widget.projects.risk', 'widget.projects.calendar'], 'Projects, tasks, assignments, delivery health and team execution.', ['agency', 'consulting', 'enterprise', 'saas', 'education']),
  createModule('documents', 'Documents', '/workspace/documents', 'operate', 60, ['read', 'create'], FileText, ['widget.documents.activity'], 'Document center, file references, records and collaboration artifacts.', ['agency', 'enterprise', 'finance', 'healthcare', 'education', 'consulting']),
  createModule('analytics', 'Analytics', '/analytics', 'intelligence', 70, ['read'], BarChart3, ['widget.analytics.executive', 'widget.analytics.kpis', 'widget.ai.insights'], 'BI dashboards, KPI management, forecasts and executive intelligence.', ['agency', 'commerce', 'enterprise', 'finance', 'manufacturing', 'saas']),
  createModule('workflows', 'Workflows', '/workspace/workflows', 'automation', 80, ['read', 'execute', 'manage'], Workflow, ['widget.workflows.health', 'widget.workflows.activity'], 'Event-driven workflow automation, approvals, execution and monitoring.', ['agency', 'enterprise', 'manufacturing', 'retail', 'saas']),
  createModule('integrations', 'Integrations', '/workspace/integrations', 'system', 90, ['read', 'manage'], GitBranch, ['widget.integrations.health'], 'External connectors, webhooks, sync jobs and API connectivity.', ['agency', 'commerce', 'enterprise', 'finance', 'saas']),
  createModule('ai', 'AI Agents', '/ai', 'intelligence', 100, ['read', 'execute'], Bot, ['widget.ai.agents', 'widget.ai.insights', 'widget.ai.recommendations'], 'Agent builder, agent monitoring, copilot actions and automation intelligence.', ['agency', 'commerce', 'enterprise', 'finance', 'saas']),
  createModule('launch-readiness', 'Launch RC', '/launch-readiness', 'system', 110, ['read', 'manage'], Rocket, ['widget.launch.readiness'], 'Launch readiness, trial setup, adoption checks and release operations.', ['enterprise', 'saas']),
  createModule('production-deployment', 'Production Ops', '/production-deployment', 'system', 120, ['read', 'manage'], ServerCog, ['widget.production.health'], 'Deployment, CI/CD, infrastructure, backup and production monitoring.', ['enterprise', 'saas']),
  createModule('public-beta', 'Public Beta', '/public-beta', 'system', 130, ['read', 'manage'], Megaphone, ['widget.beta.feedback'], 'Beta cohorts, feedback intelligence, adoption analytics and GTM readiness.', ['enterprise', 'saas']),
  createModule('enterprise-trust', 'Trust Program', '/enterprise-trust', 'system', 140, ['read', 'manage', 'approve'], ShieldCheck, ['widget.trust.security'], 'Security audit, compliance evidence, privacy and trust center operations.', ['enterprise', 'finance', 'healthcare', 'saas']),
  createModule('ecosystem-marketplace', 'Marketplace', '/ecosystem-marketplace', 'system', 150, ['read', 'create', 'manage', 'approve'], Store, ['widget.marketplace.ecosystem'], 'Partner ecosystem, developer portal, marketplace billing and certification.', ['enterprise', 'saas']),
  createModule('public-launch', 'Public Launch', '/public-launch', 'system', 160, ['read', 'create', 'manage', 'approve'], Globe2, ['widget.launch.analytics'], 'Public launch command center, pricing, trial experience and launch analytics.', ['enterprise', 'saas']),
  createModule('growth-program', 'Growth Program', '/growth-program', 'intelligence', 170, ['read', 'create', 'manage', 'approve'], TrendingUp, ['widget.growth.adoption'], 'Post-launch growth, adoption, expansion revenue and retention intelligence.', ['enterprise', 'saas']),
  createModule('autonomous-enterprise', 'Autonomous AI', '/autonomous-enterprise', 'intelligence', 180, ['read', 'create', 'manage', 'approve', 'execute'], Bot, ['widget.autonomous.reasoning'], 'Autonomous enterprise command, reasoning and goal-driven automation.', ['enterprise', 'saas']),
  createModule('enterprise-digital-twin', 'Digital Twin', '/enterprise-digital-twin', 'intelligence', 190, ['read', 'create', 'manage', 'approve', 'execute'], Network, ['widget.digital-twin.simulation'], 'Enterprise digital twin, scenario simulation and strategic planning.', ['enterprise', 'manufacturing', 'saas']),
  createModule('autonomous-operations', 'Autonomous Ops', '/autonomous-operations', 'automation', 200, ['read', 'create', 'manage', 'approve', 'execute'], ServerCog, ['widget.operations.resilience'], 'Autonomous execution, self-healing operations and governance evolution.', ['enterprise', 'saas']),
  createModule('enterprise-agi', 'Enterprise AGI', '/enterprise-agi', 'intelligence', 210, ['read', 'create', 'manage', 'approve', 'execute'], Bot, ['widget.agi.fabric'], 'Unified intelligence fabric, cross-module coordination and executive AGI workspace.', ['enterprise', 'saas']),
  createModule('settings', 'Settings', '/settings', 'system', 220, ['read', 'manage'], Settings2, ['widget.settings.governance'], 'Organization, workspace, AI, notifications and security preferences in one place.', ['agency', 'commerce', 'enterprise', 'finance', 'healthcare', 'manufacturing', 'retail', 'saas']),
];

export const moduleRegistry = new Map<ModuleKey, WorkspaceModuleConfig>(registeredWorkspaceModules.map((module) => [module.key, module]));
const v1NavigationModuleKeys = new Set<ModuleKey>(['crm', 'finance', 'hr', 'projects', 'analytics', 'ai', 'settings']);

export function getRegisteredModule(moduleKey: ModuleKey) {
  return moduleRegistry.get(moduleKey);
}

export function getRegisteredModules() {
  const showV2Modules = process.env.NEXT_PUBLIC_NEXORA_SHOW_V2_MODULES === 'true';
  return Array.from(moduleRegistry.values())
    .filter((module) => showV2Modules || v1NavigationModuleKeys.has(module.key))
    .sort((a, b) => a.order - b.order);
}

export function resolveModulesForWorkspace(industry: Industry, departments: string[]) {
  const normalizedDepartments = departments.map((department) => department.toLowerCase());
  return getRegisteredModules().map((module) => {
    const industryEnabled = module.metadata.industryFit.includes(industry) || module.metadata.industryFit.includes('enterprise');
    const departmentEnabled = isDepartmentEnabled(module.key, normalizedDepartments);
    const foundationModule = ['analytics', 'workflows', 'ai'].includes(module.key);
    return {
      ...module,
      enabled: module.enabled && (industryEnabled || departmentEnabled || foundationModule),
    };
  });
}

function createModule(
  key: ModuleKey,
  label: string,
  route: string,
  navGroup: WorkspaceModuleConfig['navGroup'],
  order: number,
  permissions: WorkspaceModuleConfig['permissions'],
  icon: WorkspaceModuleConfig['icon'],
  widgets: string[],
  description: string,
  industryFit: Industry[],
): WorkspaceModuleConfig {
  return {
    key,
    label,
    enabled: true,
    permissions,
    order,
    navGroup,
    route,
    icon,
    widgets,
    metadata: {
      category: navGroup,
      description,
      industryFit,
      featureFlags: ['dynamic-workspace', 'permission-aware-rendering'],
    },
  };
}

function isDepartmentEnabled(moduleKey: ModuleKey, departments: string[]) {
  if (moduleKey === 'crm') return departments.some((department) => ['sales', 'marketing', 'customer success', 'support'].includes(department));
  if (moduleKey === 'finance') return departments.includes('finance');
  if (moduleKey === 'hr') return departments.some((department) => ['hr', 'people', 'talent'].includes(department));
  if (moduleKey === 'projects') return departments.some((department) => ['operations', 'product', 'it', 'delivery'].includes(department));
  if (moduleKey === 'inventory') return departments.some((department) => ['operations', 'warehouse', 'logistics'].includes(department));
  return false;
}
