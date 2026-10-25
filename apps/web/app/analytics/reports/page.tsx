import { ReportBuilder } from '@/features/analytics/report-builder';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><ReportBuilder /></EnterpriseShell>;
}
