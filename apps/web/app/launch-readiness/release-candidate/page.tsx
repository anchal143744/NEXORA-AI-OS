import { ProductionUiReleaseCandidate } from '@/features/production-ui/production-ui-release-candidate';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><ProductionUiReleaseCandidate /></EnterpriseShell>;
}
