import { NavigationRefinement } from '@/features/production-ui/navigation-refinement';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><NavigationRefinement /></EnterpriseShell>;
}
