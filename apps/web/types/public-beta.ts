export type BetaStatus = 'ready' | 'watch' | 'blocked';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface PublicBetaMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface BetaCohort {
  id: string;
  name: string;
  testers: number;
  engagement: number;
  feedbackVolume: number;
  featureUsage: string;
  status: BetaStatus;
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  targetMinute: number;
  completionRate: number;
  owner: string;
}

export interface ProductTour {
  id: string;
  workspace: string;
  duration: string;
  checkpoints: string[];
  activationGoal: string;
}

export interface FeedbackSignal {
  id: string;
  source: string;
  category: string;
  sentiment: Sentiment;
  priority: Priority;
  impact: string;
  action: string;
}

export interface CustomerSuccessAccount {
  id: string;
  name: string;
  healthScore: number;
  onboardingProgress: number;
  risk: string;
  nextAction: string;
}

export interface AdoptionMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
  insight: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  votes: number;
  priority: Priority;
  roadmapStage: string;
  businessImpact: string;
}

export interface InAppFeedbackChannel {
  id: string;
  channel: string;
  captureMode: string;
  routing: string;
  responseTarget: string;
}

export interface NpsSegment {
  id: string;
  segment: string;
  score: number;
  satisfaction: string;
  driver: string;
}

export interface CommunityThread {
  id: string;
  topic: string;
  replies: number;
  owner: string;
  signal: string;
}

export interface GtmReadinessGate {
  id: string;
  gate: string;
  owner: string;
  status: BetaStatus;
  evidence: string;
}

export interface AiCustomerSuccessCommand {
  id: string;
  command: string;
  responseFocus: string;
  action: string;
}

export interface PublicBetaRoute {
  path: string;
  module: string;
  marker: string;
}
