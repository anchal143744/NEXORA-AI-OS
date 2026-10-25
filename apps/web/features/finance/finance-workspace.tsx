'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-states';
import { useFinanceWorkspaceQuery } from '@/hooks/use-finance-workspace-actions';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { useAuthStore } from '@/stores/auth-store';
import { AiFinanceCopilot } from './ai-finance-copilot';
import { BillingManagement } from './billing-management';
import { BudgetPlanning } from './budget-planning';
import { CashFlowIntelligence } from './cash-flow-intelligence';
import { ExecutiveFinanceDashboard } from './executive-finance-dashboard';
import { ExpenseManagement } from './expense-management';
import { FinanceHome } from './finance-home';
import { FinanceNavigation } from './finance-navigation';
import { FinancialAnalytics } from './financial-analytics';
import { FinancialForecasting } from './financial-forecasting';
import { InvoicesWorkspace } from './invoices-workspace';
import { PaymentsWorkspace } from './payments-workspace';
import { RevenueManagement } from './revenue-management';

export function FinanceWorkspace() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const authStatus = useAuthStore((state) => state.status);
  const financeQuery = useFinanceWorkspaceQuery();
  const isSessionLoading = !hydrated || (hydrated && authStatus === 'unknown');
  const hasFinanceRecords = Boolean(financeQuery.data && [
    financeQuery.data.billingPlans,
    financeQuery.data.revenue,
    financeQuery.data.invoices,
    financeQuery.data.payments,
    financeQuery.data.budgets,
    financeQuery.data.expenses,
    financeQuery.data.forecasts,
    financeQuery.data.cashFlow,
  ].some((items) => items.length > 0));

  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Sparkles className="size-3" />V1 Finance Workspace</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Simple, intelligent finance for operators and executives.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Billing, revenue, invoices, payments, budgets, expenses, forecasts, cash flow, analytics and AI Finance Copilot are unified into one premium workspace.</p>
          </div>
          <Badge variant={financeQuery.isSuccess ? 'success' : 'neutral'}>
            <BadgeCheck className="size-3" />
            {financeQuery.isSuccess ? 'Connected finance data' : financeQuery.isError ? 'Connection unavailable' : 'Awaiting finance data'}
          </Badge>
        </motion.div>
        <motion.div variants={staggerItem}><FinanceNavigation /></motion.div>
        {isSessionLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-6">
            <LoadingState variant="ai" label="Restoring authenticated finance session" />
          </div>
        ) : null}
        {hydrated && authStatus === 'anonymous' ? (
          <Alert title="Sign in required" variant="danger">
            Finance is protected workspace data. Sign in before opening this V1 module.
          </Alert>
        ) : null}
        {financeQuery.isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-6">
            <LoadingState variant="ai" label="Loading authorized finance workspace" />
          </div>
        ) : null}
        {financeQuery.isError ? (
          <Alert title="Finance workspace could not load" variant="danger">
            {financeQuery.error.message}
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => void financeQuery.refetch()}>Retry finance data</Button>
            </div>
          </Alert>
        ) : null}
        {financeQuery.isSuccess && !hasFinanceRecords ? (
          <EmptyState
            title="No finance records yet"
            description="Invoices, payments, budgets and cash-flow signals will appear here after they are created in the authorized workspace."
          />
        ) : null}
        {financeQuery.isSuccess && hasFinanceRecords ? (
          <>
            <FinanceHome />
            <motion.div variants={staggerItem}><AiFinanceCopilot /></motion.div>
            <motion.div variants={staggerItem} className="grid gap-4 2xl:grid-cols-2">
              <BillingManagement />
              <RevenueManagement />
            </motion.div>
            <motion.div variants={staggerItem}><InvoicesWorkspace /></motion.div>
            <motion.div variants={staggerItem} className="grid gap-4 2xl:grid-cols-2">
              <PaymentsWorkspace />
              <ExpenseManagement />
            </motion.div>
            <motion.div variants={staggerItem}><BudgetPlanning /></motion.div>
            <motion.div variants={staggerItem}><FinancialForecasting /></motion.div>
            <motion.div variants={staggerItem}><CashFlowIntelligence /></motion.div>
            <motion.div variants={staggerItem}><FinancialAnalytics /></motion.div>
            <motion.div variants={staggerItem}><ExecutiveFinanceDashboard /></motion.div>
          </>
        ) : null}
      </motion.div>
    </EnterpriseShell>
  );
}
