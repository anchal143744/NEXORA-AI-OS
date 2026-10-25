export type ReleaseTone = 'ready' | 'watch' | 'blocked';
export type ExperienceArea = 'CRM' | 'HR' | 'Finance' | 'AI Agents' | 'Analytics' | 'Command Center';
export type DeviceClass = 'Small Phones' | 'Large Phones' | 'Tablets' | 'Desktop';

export interface ReleaseMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: ReleaseTone;
}

export interface UxAuditItem {
  id: string;
  workspace: ExperienceArea;
  score: number;
  status: ReleaseTone;
  finding: string;
  action: string;
}

export interface ConsistencyRule {
  id: string;
  system: string;
  standard: string;
  coverage: number;
  status: ReleaseTone;
}

export interface ResponsiveTarget {
  id: string;
  device: DeviceClass;
  focus: string;
  status: ReleaseTone;
  checks: string[];
}

export interface AccessibilityCheck {
  id: string;
  label: string;
  standard: string;
  status: ReleaseTone;
  evidence: string;
}

export interface PerformanceTarget {
  id: string;
  label: string;
  target: string;
  measured: string;
  status: ReleaseTone;
}

export interface NavigationRefinement {
  id: string;
  area: string;
  improvement: string;
  status: ReleaseTone;
}

export interface ExperienceState {
  id: string;
  state: 'No Data' | 'No Results' | 'First Use' | 'Skeleton' | 'Progressive Loading';
  message: string;
  recoveryAction: string;
}

export interface ErrorExperience {
  id: string;
  errorType: string;
  userMessage: string;
  recoveryAction: string;
  status: ReleaseTone;
}

export interface NotificationExperience {
  id: string;
  type: 'Alert' | 'Approval' | 'Reminder' | 'AI Recommendation';
  message: string;
  action: string;
  status: ReleaseTone;
}

export interface DemoModeStep {
  id: string;
  title: string;
  objective: string;
  workspace: ExperienceArea;
}

export interface ReleaseCandidateCheck {
  id: string;
  area: string;
  result: string;
  status: ReleaseTone;
}

export interface ProductionUiWorkspaceData {
  metrics: ReleaseMetric[];
  uxAudit: UxAuditItem[];
  consistencyRules: ConsistencyRule[];
  responsiveTargets: ResponsiveTarget[];
  accessibilityChecks: AccessibilityCheck[];
  performanceTargets: PerformanceTarget[];
  navigationRefinements: NavigationRefinement[];
  experienceStates: ExperienceState[];
  errorExperiences: ErrorExperience[];
  notificationExperiences: NotificationExperience[];
  demoModeSteps: DemoModeStep[];
  releaseCandidateChecks: ReleaseCandidateCheck[];
}
