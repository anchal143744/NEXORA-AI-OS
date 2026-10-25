import { useMemo } from 'react';
import { strategyCopilotCommands } from '@/lib/enterprise-digital-twin';
import { useEnterpriseDigitalTwinStore } from '@/stores/enterprise-digital-twin-store';

export function useEnterpriseDigitalTwinActions() {
  const selectedEntity = useEnterpriseDigitalTwinStore((state) => state.selectedEntity);
  const selectedScenario = useEnterpriseDigitalTwinStore((state) => state.selectedScenario);
  const selectedMarket = useEnterpriseDigitalTwinStore((state) => state.selectedMarket);

  return useMemo(() => ({
    selectedEntity,
    selectedScenario,
    selectedMarket,
    commandCount: strategyCopilotCommands.length,
    primaryCommand: strategyCopilotCommands[0],
  }), [selectedEntity, selectedScenario, selectedMarket]);
}
