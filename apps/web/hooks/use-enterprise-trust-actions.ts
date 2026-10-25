import { useCallback } from 'react';
import { getEnterpriseTrustSnapshot } from '@/services/enterprise-trust-api';
import { useEnterpriseTrustStore } from '@/stores/enterprise-trust-store';

export function useEnterpriseTrustActions() {
  const setSelectedFinding = useEnterpriseTrustStore((state) => state.setSelectedFinding);
  const setSelectedFramework = useEnterpriseTrustStore((state) => state.setSelectedFramework);
  const setSelectedRisk = useEnterpriseTrustStore((state) => state.setSelectedRisk);

  const inspectFinding = useCallback((finding: string) => setSelectedFinding(finding), [setSelectedFinding]);
  const inspectFramework = useCallback((framework: string) => setSelectedFramework(framework), [setSelectedFramework]);
  const inspectRisk = useCallback((risk: string) => setSelectedRisk(risk), [setSelectedRisk]);

  return {
    inspectFinding,
    inspectFramework,
    inspectRisk,
    loadSnapshot: getEnterpriseTrustSnapshot,
  };
}
