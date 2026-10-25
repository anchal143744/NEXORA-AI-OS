export const REPORT_TYPES = ['executive','finance','sales','hr','operations','ai_insight'] as const;
export const REPORT_FORMATS = ['pdf','csv','excel','json'] as const;
export type ReportType = (typeof REPORT_TYPES)[number];
export type ReportFormat = (typeof REPORT_FORMATS)[number];
