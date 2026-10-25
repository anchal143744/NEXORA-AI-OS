export const finopsApi = {
  finops: '/v1/finops',
  costIntelligence: '/v1/cost-intelligence',
  performance: '/v1/performance',
  resourceUsage: '/v1/resource-usage',
  costForecast: '/v1/cost-forecast',
  optimization: '/v1/optimization',
  budgets: '/v1/budgets',
  efficiency: '/v1/efficiency',
} as const;

export type FinOpsApiGroup = keyof typeof finopsApi;