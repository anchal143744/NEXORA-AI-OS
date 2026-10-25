import type { AiSalesInsight, CrmMetric, CrmWorkspaceData, LeadRecord, OpportunityRecord, OpportunityStage, RevenueForecast, RevenueOperationsMetric } from '@/types/crm-workspace';

export const opportunityStages: Array<{ id: OpportunityStage; label: string; description: string }> = [
  { id: 'lead', label: 'Lead', description: 'Unqualified demand entering the revenue motion.' },
  { id: 'qualified', label: 'Qualified', description: 'Fit, intent and timing are confirmed.' },
  { id: 'discovery', label: 'Discovery', description: 'Pain, stakeholders and buying process are mapped.' },
  { id: 'proposal', label: 'Proposal', description: 'Commercial proposal or quote is active.' },
  { id: 'negotiation', label: 'Negotiation', description: 'Procurement, legal or pricing alignment is underway.' },
  { id: 'closed_won', label: 'Closed Won', description: 'Revenue accepted and handoff ready.' },
  { id: 'closed_lost', label: 'Closed Lost', description: 'Opportunity closed without revenue.' },
];

export function createEmptyCrmWorkspaceData(): CrmWorkspaceData {
  const opportunities: OpportunityRecord[] = [];
  return {
    metrics: createCrmMetrics(opportunities),
    leads: [],
    contacts: [],
    accounts: [],
    opportunities,
    activities: [],
    timeline: [],
    proposals: [],
    forecasts: createForecasts(opportunities),
    revOps: createRevOpsMetrics(opportunities),
    insights: createAiSalesInsights({ leads: [], opportunities }),
  };
}

export function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function calculateWeightedPipeline(items: OpportunityRecord[]) {
  return items.filter((item) => item.stage !== 'closed_lost').reduce((sum, item) => sum + item.value * (item.probability / 100), 0);
}

export function calculatePipelineValue(items: OpportunityRecord[]) {
  return items.filter((item) => !['closed_lost', 'closed_won'].includes(item.stage)).reduce((sum, item) => sum + item.value, 0);
}

export function createCrmMetrics(items: OpportunityRecord[]): CrmMetric[] {
  const openOpportunities = items.filter((item) => !['closed_won', 'closed_lost'].includes(item.stage));
  const won = items.filter((item) => item.stage === 'closed_won');
  const pipeline = calculatePipelineValue(items);
  const weighted = calculateWeightedPipeline(openOpportunities);
  const hasRisk = openOpportunities.some((item) => item.risk !== 'low');

  return [
    { id: 'revenue', label: 'Revenue Overview', value: currency(won.reduce((sum, item) => sum + item.value, 0)), detail: 'Closed revenue from CRM opportunities', trend: won.length ? `${won.length} won deal${won.length === 1 ? '' : 's'}` : 'No closed revenue yet', tone: won.length ? 'healthy' : 'watch' },
    { id: 'pipeline', label: 'Pipeline Value', value: currency(pipeline), detail: String(openOpportunities.length) + ' active opportunities', trend: openOpportunities.length ? 'Live pipeline' : 'No open pipeline', tone: openOpportunities.length ? 'healthy' : 'watch' },
    { id: 'open', label: 'Open Opportunities', value: String(openOpportunities.length), detail: 'Active revenue conversations', trend: hasRisk ? 'Risk review needed' : 'No active risk', tone: hasRisk ? 'watch' : 'healthy' },
    { id: 'forecast', label: 'Forecast Revenue', value: currency(weighted), detail: 'Weighted by stage probability', trend: weighted ? 'Probability weighted' : 'Add opportunities', tone: weighted ? 'healthy' : 'watch' },
  ];
}

export function createForecasts(items: OpportunityRecord[]): RevenueForecast[] {
  const weighted = calculateWeightedPipeline(items);
  const committed = items.filter((item) => ['negotiation', 'closed_won'].includes(item.stage)).reduce((sum, item) => sum + item.value * (item.probability / 100), 0);
  const bestCase = items.filter((item) => item.stage !== 'closed_lost').reduce((sum, item) => sum + item.value, 0);
  const accuracy = items.length ? Math.min(92, 62 + items.filter((item) => item.forecastClose !== 'No close date').length * 4) : 0;
  return [
    { period: 'monthly', committed: Math.round(committed * 0.42), bestCase: Math.round(bestCase * 0.36), pipeline: Math.round(calculatePipelineValue(items) * 0.36), weighted: Math.round(weighted * 0.42), accuracy },
    { period: 'quarterly', committed: Math.round(committed), bestCase: Math.round(bestCase), pipeline: calculatePipelineValue(items), weighted: Math.round(weighted), accuracy },
    { period: 'annual', committed: Math.round(committed * 3.8), bestCase: Math.round(bestCase * 4.1), pipeline: Math.round(calculatePipelineValue(items) * 4.1), weighted: Math.round(weighted * 3.9), accuracy: items.length ? Math.max(45, accuracy - 8) : 0 },
  ];
}

export function createRevOpsMetrics(items: OpportunityRecord[]): RevenueOperationsMetric[] {
  const open = items.filter((item) => !['closed_won', 'closed_lost'].includes(item.stage));
  const risks = open.filter((item) => item.risk !== 'low').length;
  const won = items.filter((item) => item.stage === 'closed_won').length;
  const lost = items.filter((item) => item.stage === 'closed_lost').length;
  const closed = won + lost;
  const winRate = closed ? Math.round((won / closed) * 100) : 0;
  const forecastAccuracy = items.length ? Math.min(92, 62 + items.filter((item) => item.forecastClose !== 'No close date').length * 4) : 0;
  const pipeline = calculatePipelineValue(items);
  const wonRevenue = items.filter((item) => item.stage === 'closed_won').reduce((sum, item) => sum + item.value, 0);

  return [
    { id: 'pipeline-health', label: 'Pipeline Health', value: risks ? 'Watch' : open.length ? 'Healthy' : 'Empty', benchmark: String(risks) + ' risk signals', signal: risks ? 'watch' : 'positive' },
    { id: 'win-rate', label: 'Win Rate', value: String(winRate) + '%', benchmark: closed ? String(closed) + ' closed opportunities' : 'No closed opportunities yet', signal: winRate >= 34 ? 'positive' : 'watch' },
    { id: 'forecast-accuracy', label: 'Forecast Accuracy', value: String(forecastAccuracy) + '%', benchmark: items.length ? 'Based on close date coverage' : 'Add opportunities to forecast', signal: forecastAccuracy >= 70 ? 'positive' : 'watch' },
    { id: 'growth', label: 'Revenue Growth', value: pipeline || wonRevenue ? currency(pipeline + wonRevenue) : currency(0), benchmark: 'Open pipeline plus won revenue', signal: pipeline || wonRevenue ? 'positive' : 'watch' },
  ];
}

export function createAiSalesInsights(data: { leads: LeadRecord[]; opportunities: OpportunityRecord[] }): AiSalesInsight[] {
  if (data.leads.length === 0 && data.opportunities.length === 0) {
    return [{ id: 'crm-empty', title: 'CRM is ready for live data', summary: 'Create or import leads and opportunities to activate pipeline health, forecast and customer recommendations.', severity: 'info', action: 'Create the first lead or import CRM records.' }];
  }

  const insights: AiSalesInsight[] = [];
  const hotLead = [...data.leads].sort((a, b) => b.score - a.score)[0];
  const riskDeal = data.opportunities.find((item) => item.risk === 'high') ?? data.opportunities.find((item) => item.risk === 'medium');

  if (hotLead) {
    insights.push({ id: 'hot-lead', title: hotLead.company + ' is the hottest lead', summary: hotLead.name + ' has a ' + String(hotLead.conversionProbability) + '% conversion probability from live lead data.', severity: 'opportunity', action: hotLead.nextBestAction });
  }
  if (riskDeal) {
    insights.push({ id: 'deal-risk', title: riskDeal.accountName + ' needs attention', summary: riskDeal.title + ' has a ' + riskDeal.risk + ' risk signal at ' + riskDeal.stage.replace('_', ' ') + ' stage.', severity: riskDeal.risk === 'high' ? 'risk' : 'info', action: riskDeal.nextStep });
  }
  if (data.opportunities.length) {
    insights.push({ id: 'pipeline-health', title: 'Pipeline forecast is calculated from live opportunities', summary: 'NEXORA weighs opportunity stage, probability, amount and close date coverage for forecast confidence.', severity: 'info', action: 'Keep opportunity amount, probability and close date current.' });
  }
  return insights;
}

export function scoreLead(lead: LeadRecord) {
  const score = lead.score;
  if (score >= 90) return { label: 'Hot', tone: 'healthy' as const, action: lead.nextBestAction };
  if (score >= 75) return { label: 'Warm', tone: 'watch' as const, action: lead.nextBestAction };
  return { label: 'Nurture', tone: 'risk' as const, action: lead.nextBestAction || 'Add to nurture sequence and monitor intent changes.' };
}
