import type { LucideIcon } from 'lucide-react';

export type Industry =
  | 'technology'
  | 'agency'
  | 'commerce'
  | 'manufacturing'
  | 'finance'
  | 'healthcare'
  | 'enterprise'
  | 'saas'
  | 'ecommerce'
  | 'retail'
  | 'education'
  | 'logistics'
  | 'consulting';

export type WorkspaceRole = 'owner' | 'admin' | 'manager' | 'team_lead' | 'employee' | 'viewer';
export type Permission = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'approve' | 'execute';

export type ModuleKey =
  | 'crm'
  | 'finance'
  | 'hr'
  | 'inventory'
  | 'projects'
  | 'tasks'
  | 'documents'
  | 'analytics'
  | 'workflows'
  | 'integrations'
  | 'ai'
  | 'launch-readiness'
  | 'production-deployment'
  | 'public-beta'
  | 'enterprise-trust'
  | 'ecosystem-marketplace'
  | 'public-launch'
  | 'growth-program'
  | 'autonomous-enterprise'
  | 'enterprise-digital-twin'
  | 'autonomous-operations'
  | 'enterprise-agi'
  | 'settings';

export type NavigationGroup = 'operate' | 'intelligence' | 'automation' | 'system';
export type WorkspaceWidgetType = 'kpi' | 'revenue' | 'sales' | 'inventory' | 'tasks' | 'calendar' | 'activity' | 'ai-insights' | 'notifications' | 'analytics';
export type WorkspaceWidgetSize = 'sm' | 'md' | 'lg' | 'xl';

export interface WorkspaceModuleMetadata {
  category: string;
  description: string;
  industryFit: Industry[];
  featureFlags?: string[];
}

export interface WorkspaceModuleConfig {
  key: ModuleKey;
  label: string;
  enabled: boolean;
  permissions: Permission[];
  order: number;
  navGroup: NavigationGroup;
  route: string;
  icon?: LucideIcon;
  widgets: string[];
  metadata: WorkspaceModuleMetadata;
}

export interface WorkspaceKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  moduleKey: ModuleKey;
  permissions: Permission[];
}

export interface WorkspaceReport {
  id: string;
  label: string;
  moduleKey: ModuleKey;
  cadence: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  permissions: Permission[];
}

export interface WorkspaceAiAgent {
  id: string;
  label: string;
  moduleKey: ModuleKey;
  status: 'active' | 'recommended' | 'disabled';
  permissions: Permission[];
}

export interface WorkspaceWidgetConfig {
  id: string;
  type: WorkspaceWidgetType;
  title: string;
  description: string;
  moduleKey: ModuleKey;
  permissions: Permission[];
  order: number;
  size: WorkspaceWidgetSize;
  pinned?: boolean;
  data: Record<string, unknown>;
}

export interface WorkspacePersonalization {
  pinnedWidgetIds: string[];
  favoriteModuleKeys: ModuleKey[];
  recentItemIds: string[];
  layoutOrder: string[];
  savedLayouts: Array<{ id: string; label: string; widgetIds: string[]; updatedAt: string }>;
}

export interface WorkspaceUserContext {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  permissions: Permission[];
}

export interface WorkspaceEntityContext {
  id: string;
  name: string;
  slug?: string;
}

export interface WorkspaceConfiguration {
  workspaceId: string;
  workspaceName: string;
  organizationId: string;
  organizationName: string;
  tenantId: string;
  tenantName: string;
  businessType: string;
  industry: Industry;
  departments: string[];
  roles: WorkspaceRole[];
  permissions: Permission[];
  modules: WorkspaceModuleConfig[];
  navigation: NavigationItem[];
  widgets: WorkspaceWidgetConfig[];
  kpis: WorkspaceKpi[];
  reports: WorkspaceReport[];
  aiAgents: WorkspaceAiAgent[];
  locale: string;
  currency: string;
  timezone: string;
  featureFlags: Record<string, boolean>;
  personalization: WorkspacePersonalization;
  currentUser: WorkspaceUserContext;
  organization: WorkspaceEntityContext;
  tenant: WorkspaceEntityContext;
  workspace: WorkspaceEntityContext;
  selectedModuleKey?: ModuleKey;
  selectedFilters: Record<string, string>;
}

export interface NavigationItem {
  key: string;
  label: string;
  route: string;
  group: NavigationGroup;
  icon?: LucideIcon;
  permissions: Permission[];
  moduleKey: ModuleKey;
  order: number;
}

export interface WorkspaceAiContext {
  workspaceId: string;
  workspaceName: string;
  organizationId: string;
  organizationName: string;
  tenantId: string;
  industry: Industry;
  locale: string;
  currency: string;
  timezone: string;
  currentModule?: ModuleKey;
  currentUser: WorkspaceUserContext;
  enabledModules: Array<{ key: ModuleKey; label: string; route: string }>;
  kpis: WorkspaceKpi[];
  selectedFilters: Record<string, string>;
  permissions: Permission[];
}
