import { PerformanceOptimization } from '@/features/production-ui/performance-optimization';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><PerformanceOptimization /></EnterpriseShell>;
}
