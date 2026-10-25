import { ExecutiveScorecards } from '@/features/analytics/executive-scorecards';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><ExecutiveScorecards /></EnterpriseShell>;
}
