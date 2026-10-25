import { ErrorHandlingExperience } from '@/features/production-ui/error-handling-experience';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><ErrorHandlingExperience /></EnterpriseShell>;
}
