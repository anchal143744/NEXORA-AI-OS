import { UiConsistencyEngine } from '@/features/production-ui/ui-consistency-engine';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><UiConsistencyEngine /></EnterpriseShell>;
}
