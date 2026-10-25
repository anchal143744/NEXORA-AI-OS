export const KPI_PERIODS = ['daily','weekly','monthly','quarterly','yearly'] as const;
export type KpiPeriod = (typeof KPI_PERIODS)[number];
export const KPI_CATEGORIES = ['crm','finance','hr','operations'] as const;
export type KpiCategory = (typeof KPI_CATEGORIES)[number];
export interface KpiDefinition { key: string; name: string; category: KpiCategory; unit?: string; description: string; }
export interface KpiSnapshotInput { tenantId: string; workspaceId?: string; period: KpiPeriod; periodStart: Date; periodEnd: Date; }
