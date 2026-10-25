'use client';

import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApproveLeaveRequest } from '@/hooks/use-people-workspace-actions';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';
import type { LeaveStatus } from '@/types/people-workspace';

const statuses: Array<LeaveStatus | 'all'> = ['all', 'pending', 'approved', 'rejected'];

export function LeaveManagement() {
  const leaveRequests = usePeopleWorkspaceStore((state) => state.leaveRequests);
  const balances = usePeopleWorkspaceStore((state) => state.leaveBalances);
  const filter = usePeopleWorkspaceStore((state) => state.leaveStatusFilter);
  const setFilter = usePeopleWorkspaceStore((state) => state.setLeaveStatusFilter);
  const approve = useApproveLeaveRequest();
  const visible = leaveRequests.filter((leave) => filter === 'all' || leave.status === filter);
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Leave Management</CardTitle>
          <CardDescription>Leave requests, approvals, balances, holiday awareness and manager-friendly review.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button key={status} className={'rounded-md border px-3 py-2 text-xs capitalize transition ' + (filter === status ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 bg-white/[0.05] text-graphite-300 hover:text-white')} onClick={() => setFilter(status)}>
              {status}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {visible.map((leave) => (
            <article key={leave.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{leave.employeeName}</div>
                  <div className="mt-1 text-xs text-graphite-400">{leave.type} - {leave.startDate} to {leave.endDate} - {leave.days} days</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'pending' ? 'warning' : 'neutral'}>{leave.status}</Badge>
                  {leave.status === 'pending' ? <Button size="sm" variant="outline" onClick={() => approve.mutate(leave)}><CheckCircle2 className="size-4" />Approve</Button> : null}
                </div>
              </div>
              <div className="mt-2 text-xs text-graphite-500">Approver: {leave.approver}</div>
            </article>
          ))}
        </div>
        <div className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><CalendarDays className="size-4 text-gold-200" />Leave balances</div>
          <div className="mt-3 space-y-2">
            {balances.map((balance) => (
              <div key={balance.employeeName} className="rounded-md bg-white/[0.04] p-3 text-xs text-graphite-300">
                <div className="font-semibold text-white">{balance.employeeName}</div>
                <div className="mt-1">Vacation {balance.vacation} - Sick {balance.sick} - Personal {balance.personal}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
