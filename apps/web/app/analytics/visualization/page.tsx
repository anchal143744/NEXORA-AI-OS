import { DataVisualizationStudio } from '@/features/analytics/data-visualization-studio';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><DataVisualizationStudio /></EnterpriseShell>;
}
