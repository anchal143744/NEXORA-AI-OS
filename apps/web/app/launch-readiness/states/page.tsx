import { EmptyLoadingStates } from '@/features/production-ui/empty-loading-states';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><EmptyLoadingStates /></EnterpriseShell>;
}
