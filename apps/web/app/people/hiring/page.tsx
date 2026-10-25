import { CandidatePipeline } from '@/features/people/candidate-pipeline';
import { HiringWorkspace } from '@/features/people/hiring-workspace';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><HiringWorkspace /><CandidatePipeline /></div></EnterpriseShell>;
}
