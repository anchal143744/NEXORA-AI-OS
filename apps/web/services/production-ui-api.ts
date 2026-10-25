import { createProductionUiWorkspaceData } from '@/lib/production-ui';
import type { ProductionUiWorkspaceData } from '@/types/production-ui';

export const productionUiApi = {
  async getWorkspace(): Promise<ProductionUiWorkspaceData> {
    return createProductionUiWorkspaceData();
  },
  async runDemoTour(stepId: string) {
    return { stepId, status: 'tour_started' as const };
  },
  async markReleaseCandidateReady() {
    return { status: 'release_candidate_ready' as const, version: '2.0.0-RC1' };
  },
};
