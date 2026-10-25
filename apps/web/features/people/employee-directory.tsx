'use client';

import { FileText, Search, ShieldCheck, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';
import type { EmployeeStatus } from '@/types/people-workspace';

const statuses: Array<EmployeeStatus | 'all'> = ['all', 'active', 'on_leave', 'probation', 'alumni'];

export function EmployeeDirectory() {
  const employees = usePeopleWorkspaceStore((state) => state.employees);
  const query = usePeopleWorkspaceStore((state) => state.searchQuery);
  const setQuery = usePeopleWorkspaceStore((state) => state.setSearchQuery);
  const filter = usePeopleWorkspaceStore((state) => state.employeeStatusFilter);
  const setFilter = usePeopleWorkspaceStore((state) => state.setEmployeeStatusFilter);
  const visible = employees.filter((employee) => (filter === 'all' || employee.status === filter) && (employee.name.toLowerCase().includes(query.toLowerCase()) || employee.department.toLowerCase().includes(query.toLowerCase()) || employee.skills.join(' ').toLowerCase().includes(query.toLowerCase())));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Employee profiles, teams, departments, search, skills and documents.</CardDescription>
        </div>
        <Button size="sm" disabled title="Employee creation is not exposed in the V1 frontend yet">
          <UserRound className="size-4" />
          Add employee
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-500" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees, departments or skills" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button key={status} className={'rounded-md border px-3 py-2 text-xs capitalize transition ' + (filter === status ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 bg-white/[0.05] text-graphite-300 hover:text-white')} onClick={() => setFilter(status)}>
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {visible.map((employee) => (
            <article key={employee.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-base font-semibold text-white">{employee.name}</div>
                  <div className="mt-1 text-sm text-graphite-300">{employee.role} - {employee.department}</div>
                </div>
                <Badge variant={employee.status === 'active' ? 'success' : employee.status === 'on_leave' ? 'warning' : 'neutral'}>{employee.status.replace('_', ' ')}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-graphite-300 md:grid-cols-3">
                <span>Team: {employee.team}</span>
                <span>Manager: {employee.manager}</span>
                <span>Location: {employee.location}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">{employee.skills.map((skill) => <Badge key={skill} variant="neutral">{skill}</Badge>)}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-graphite-400">
                {employee.documents.map((document) => <span key={document} className="rounded-sm border border-white/10 bg-graphite-950/70 px-2 py-1"><FileText className="mr-1 inline size-3 text-gold-200" />{document}</span>)}
              </div>
              <div className="mt-3 text-xs text-graphite-400"><ShieldCheck className="mr-1 inline size-3 text-gold-200" />Engagement score: {employee.engagement}%</div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
