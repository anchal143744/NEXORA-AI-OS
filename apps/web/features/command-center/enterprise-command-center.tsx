'use client';

import { DynamicWorkspaceEngine } from '@/features/workspace/dynamic-workspace-engine';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export function EnterpriseCommandCenter() {
  return (
    <EnterpriseShell>
      <DynamicWorkspaceEngine />
    </EnterpriseShell>
  );
}
