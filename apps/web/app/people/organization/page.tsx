import { OrganizationChart } from '@/features/people/organization-chart';
import { WorkforceAnalytics } from '@/features/people/workforce-analytics';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><OrganizationChart /><WorkforceAnalytics /></div></EnterpriseShell>;
}
