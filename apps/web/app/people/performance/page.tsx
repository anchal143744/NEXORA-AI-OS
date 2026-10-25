import { GoalsReviews } from '@/features/people/goals-reviews';
import { PerformanceManagement } from '@/features/people/performance-management';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><PerformanceManagement /><GoalsReviews /></div></EnterpriseShell>;
}
