import { createAnalyticsWorkspaceData, runAiAnalyticsCommand } from '@/lib/analytics-workspace';
import type { AiAnalyticsCommandResult, AnalyticsWorkspaceData } from '@/types/analytics-workspace';

export const analyticsWorkspaceApi = {
  async getWorkspace(): Promise<AnalyticsWorkspaceData> {
    return createAnalyticsWorkspaceData();
  },
  async runCopilotCommand(command: string): Promise<AiAnalyticsCommandResult> {
    return runAiAnalyticsCommand(command);
  },
  async scheduleReport(reportId: string) {
    return { reportId, status: 'scheduled' as const };
  },
  async createKpiAlert(kpiId: string) {
    return { kpiId, status: 'alert_created' as const };
  },
};
