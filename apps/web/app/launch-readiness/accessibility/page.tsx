import { AccessibilityEnhancement } from '@/features/production-ui/accessibility-enhancement';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><AccessibilityEnhancement /></EnterpriseShell>;
}
