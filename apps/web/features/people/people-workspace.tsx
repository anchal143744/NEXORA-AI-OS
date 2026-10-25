'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-states';
import { usePeopleWorkspaceQuery } from '@/hooks/use-people-workspace-actions';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { useAuthStore } from '@/stores/auth-store';
import { AiHrCopilot } from './ai-hr-copilot';
import { AttendanceManagement } from './attendance-management';
import { CandidatePipeline } from './candidate-pipeline';
import { EmployeeDirectory } from './employee-directory';
import { GoalsReviews } from './goals-reviews';
import { HiringWorkspace } from './hiring-workspace';
import { HrHome } from './hr-home';
import { LearningDevelopment } from './learning-development';
import { LeaveManagement } from './leave-management';
import { OrganizationChart } from './organization-chart';
import { PeopleNavigation } from './people-navigation';
import { PerformanceManagement } from './performance-management';
import { WorkforceAnalytics } from './workforce-analytics';

export function PeopleWorkspace() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const authStatus = useAuthStore((state) => state.status);
  const peopleQuery = usePeopleWorkspaceQuery();
  const isSessionLoading = !hydrated || (hydrated && authStatus === 'unknown');
  const hasPeopleRecords = Boolean(peopleQuery.data && [
    peopleQuery.data.employees,
    peopleQuery.data.attendance,
    peopleQuery.data.leaveRequests,
    peopleQuery.data.leaveBalances,
    peopleQuery.data.jobs,
    peopleQuery.data.candidates,
    peopleQuery.data.reviews,
    peopleQuery.data.goals,
    peopleQuery.data.learning,
    peopleQuery.data.orgNodes,
  ].some((items) => items.length > 0));

  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Sparkles className="size-3" />V1 People Workspace</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Simple, premium HR for employees, managers and people teams.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">People, hiring, growth and organization tools are grouped into a friendly workspace with attendance, leave, candidates, performance, learning, analytics and AI HR Copilot.</p>
          </div>
          <Badge variant="success"><BadgeCheck className="size-3" />Live people data</Badge>
        </motion.div>
        <motion.div variants={staggerItem}><PeopleNavigation /></motion.div>
        {isSessionLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-6">
            <LoadingState variant="ai" label="Restoring authenticated people session" />
          </div>
        ) : null}
        {hydrated && authStatus === 'anonymous' ? (
          <Alert title="Sign in required" variant="danger">
            People is protected workspace data. Sign in before opening this V1 module.
          </Alert>
        ) : null}
        {peopleQuery.isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-6">
            <LoadingState variant="ai" label="Loading authorized people workspace" />
          </div>
        ) : null}
        {peopleQuery.isError ? (
          <Alert title="People workspace could not load" variant="danger">
            {peopleQuery.error.message}
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => void peopleQuery.refetch()}>Retry people data</Button>
            </div>
          </Alert>
        ) : null}
        {peopleQuery.isSuccess && !hasPeopleRecords ? (
          <EmptyState
            title="No people records yet"
            description="Employee profiles, attendance, leave, hiring and organization data will appear after they are created in the authorized workspace."
          />
        ) : null}
        {peopleQuery.isSuccess && hasPeopleRecords ? (
          <>
            <HrHome />
            <motion.div variants={staggerItem}><AiHrCopilot /></motion.div>
            <motion.div variants={staggerItem}><EmployeeDirectory /></motion.div>
            <motion.div variants={staggerItem} className="grid gap-4 2xl:grid-cols-2">
              <AttendanceManagement />
              <LeaveManagement />
            </motion.div>
            <motion.div variants={staggerItem}><HiringWorkspace /></motion.div>
            <motion.div variants={staggerItem}><CandidatePipeline /></motion.div>
            <motion.div variants={staggerItem} className="grid gap-4 2xl:grid-cols-2">
              <PerformanceManagement />
              <GoalsReviews />
            </motion.div>
            <motion.div variants={staggerItem}><LearningDevelopment /></motion.div>
            <motion.div variants={staggerItem}><OrganizationChart /></motion.div>
            <motion.div variants={staggerItem}><WorkforceAnalytics /></motion.div>
          </>
        ) : null}
      </motion.div>
    </EnterpriseShell>
  );
}
