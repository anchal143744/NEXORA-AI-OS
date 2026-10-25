import type { ReactNode } from 'react';
import { EnterpriseShell } from './enterprise-shell';

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <EnterpriseShell>{children}</EnterpriseShell>;
}
