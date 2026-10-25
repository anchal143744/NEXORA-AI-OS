'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useCrmWorkspaceQuery } from '@/hooks/use-crm-workspace-actions';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AccountManagement } from './account-management';
import { ActivityCenter } from './activity-center';
import { AiSalesCopilot } from './ai-sales-copilot';
import { ContactManagement } from './contact-management';
import { CrmHome } from './crm-home';
import { CustomerTimeline } from './customer-timeline';
import { LeadManagement } from './lead-management';
import { OpportunityManagement } from './opportunity-management';
import { QuoteProposalWorkspace } from './quote-proposal-workspace';
import { RevenueForecasting } from './revenue-forecasting';
import { RevenueOperationsDashboard } from './revenue-operations-dashboard';
import { VisualSalesPipeline } from './visual-sales-pipeline';

export function CrmWorkspace() {
  const crmQuery = useCrmWorkspaceQuery();

  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Sparkles className="size-3" />CRM Workspace</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Revenue operations, pipeline intelligence and AI sales execution.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Live CRM data for leads, contacts, accounts, opportunities, customer timeline, proposal approvals, revenue forecasting and AI Sales Copilot.</p>
          </div>
          <Badge variant="success"><BadgeCheck className="size-3" />Database-backed</Badge>
        </motion.div>

        {crmQuery.isPending ? <CrmWorkspaceLoading /> : null}
        {crmQuery.isError ? (
          <ErrorState
            title="CRM data could not load"
            description="NEXORA could not reach the CRM API for this workspace. Check the API connection and retry."
            action={<Button onClick={() => void crmQuery.refetch()}>Retry CRM sync</Button>}
          />
        ) : null}
        {!crmQuery.isPending && !crmQuery.isError ? <CrmWorkspacePanels /> : null}
      </motion.div>
    </EnterpriseShell>
  );
}

function CrmWorkspacePanels() {
  return (
    <>
      <CrmHome />
      <motion.div variants={staggerItem}><AiSalesCopilot /></motion.div>
      <motion.div variants={staggerItem}><VisualSalesPipeline /></motion.div>
      <motion.div variants={staggerItem}><LeadManagement /></motion.div>
      <motion.div variants={staggerItem}><OpportunityManagement /></motion.div>
      <motion.div variants={staggerItem} className="grid gap-4 2xl:grid-cols-2">
        <ContactManagement />
        <AccountManagement />
      </motion.div>
      <motion.div variants={staggerItem}><ActivityCenter /></motion.div>
      <motion.div variants={staggerItem} className="grid gap-4 2xl:grid-cols-[0.95fr_1.05fr]">
        <CustomerTimeline />
        <QuoteProposalWorkspace />
      </motion.div>
      <motion.div variants={staggerItem}><RevenueForecasting /></motion.div>
      <motion.div variants={staggerItem}><RevenueOperationsDashboard /></motion.div>
    </>
  );
}

function CrmWorkspaceLoading() {
  return (
    <div className="space-y-4" aria-label="Loading CRM workspace">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-56" />
      <Skeleton className="h-[420px]" />
    </div>
  );
}
