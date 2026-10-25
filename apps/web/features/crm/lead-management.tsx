'use client';

import { CheckCircle2, Search, UserPlus, UserRound } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { useCreateCrmLead } from '@/hooks/use-crm-workspace-actions';
import { scoreLead } from '@/lib/crm-workspace';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';
import type { LeadStatus } from '@/types/crm-workspace';

const statuses: Array<LeadStatus | 'all'> = ['all', 'new', 'assigned', 'qualified', 'nurture', 'converted', 'disqualified'];
const leadStatusOptions = statuses.filter(isLeadStatus).map((status) => ({ label: status.replace('_', ' '), value: status }));
const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Outbound', 'Event', 'Partner', 'Customer Success'].map((source) => ({ label: source, value: source }));

type LeadFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  source: string;
  status: LeadStatus;
  estimatedValue: string;
  tags: string;
};

const emptyLeadForm: LeadFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  source: 'Website',
  status: 'new',
  estimatedValue: '',
  tags: '',
};

export function LeadManagement() {
  const leads = useCrmWorkspaceStore((state) => state.leads);
  const filter = useCrmWorkspaceStore((state) => state.leadStatusFilter);
  const setFilter = useCrmWorkspaceStore((state) => state.setLeadStatusFilter);
  const query = useCrmWorkspaceStore((state) => state.searchQuery);
  const setQuery = useCrmWorkspaceStore((state) => state.setSearchQuery);
  const visible = useMemo(
    () => leads.filter((lead) => (filter === 'all' || lead.status === filter) && (lead.company.toLowerCase().includes(query.toLowerCase()) || lead.name.toLowerCase().includes(query.toLowerCase()))),
    [filter, leads, query],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Lead Management</CardTitle>
          <CardDescription>Lead creation, assignment, scoring, qualification and lifecycle tracking.</CardDescription>
        </div>
        <CreateLeadDialog />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-500" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads by person or company" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button key={status} className={'rounded-md border px-3 py-2 text-xs capitalize transition ' + (filter === status ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 bg-white/[0.05] text-graphite-300 hover:text-white')} onClick={() => setFilter(status)}>
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState className="mt-4" icon={UserRound} title="No leads match this view" description="Create or import leads to activate scoring, assignment, lifecycle tracking and AI next best actions." />
        ) : (
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {visible.map((lead) => {
            const score = scoreLead(lead);
            return (
              <article key={lead.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-base font-semibold text-white">{lead.company}</div>
                    <div className="mt-1 text-sm text-graphite-300">{lead.name} - {lead.role}</div>
                  </div>
                  <Badge variant={score.tone === 'healthy' ? 'success' : score.tone === 'watch' ? 'warning' : 'neutral'}>{score.label} {lead.score}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-graphite-300 md:grid-cols-3">
                  <span>Owner: {lead.owner}</span>
                  <span>Source: {lead.source}</span>
                  <span>Probability: {lead.conversionProbability}%</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lead.tags.map((tag) => <Badge key={tag} variant="neutral">{tag}</Badge>)}
                </div>
                <div className="mt-3 rounded-md border border-white/10 bg-graphite-950/60 p-3 text-xs leading-5 text-graphite-300">
                  <CheckCircle2 className="mr-1 inline size-3 text-gold-200" />Next best action: {score.action}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {lead.lifecycle.map((step) => <span key={step} className="rounded-sm bg-white/[0.06] px-2 py-1 text-[11px] text-graphite-300">{step}</span>)}
                </div>
              </article>
            );
          })}
        </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateLeadDialog() {
  const createLead = useCreateCrmLead();
  const toast = useToast((state) => state.push);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LeadFormState>(emptyLeadForm);
  const [formError, setFormError] = useState('');

  function updateField(field: keyof LeadFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const company = form.company.trim();
    const estimatedValue = form.estimatedValue.trim() ? Number(form.estimatedValue) : undefined;

    if (!firstName || !email || !company) {
      setFormError('Enter a contact name, email and company before creating the lead.');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Enter a valid business email address.');
      return;
    }

    if (estimatedValue !== undefined && (!Number.isFinite(estimatedValue) || estimatedValue < 0)) {
      setFormError('Estimated value must be a positive number.');
      return;
    }

    try {
      await createLead.mutateAsync({
        firstName,
        lastName: lastName || undefined,
        email,
        phone: form.phone.trim() || undefined,
        company,
        role: form.role.trim() || undefined,
        source: form.source,
        status: form.status,
        estimatedValue,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      toast({ title: 'Lead created', description: company + ' was added to the CRM pipeline.', tone: 'success' });
      setForm(emptyLeadForm);
      setOpen(false);
    } catch {
      setFormError('NEXORA could not create this lead. Check your connection and try again.');
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setFormError('');
      }}
      trigger={<Button size="sm"><UserPlus className="size-4" />Create lead</Button>}
      title="Create CRM lead"
      description="Add a real lead to this workspace. NEXORA will score it and refresh CRM intelligence from the database."
      className="max-w-2xl"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="First name" htmlFor="lead-first-name" required>
            <Input id="lead-first-name" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} disabled={createLead.isPending} autoComplete="given-name" />
          </Field>
          <Field label="Last name" htmlFor="lead-last-name">
            <Input id="lead-last-name" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} disabled={createLead.isPending} autoComplete="family-name" />
          </Field>
          <Field label="Business email" htmlFor="lead-email" required>
            <Input id="lead-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} disabled={createLead.isPending} autoComplete="email" />
          </Field>
          <Field label="Phone" htmlFor="lead-phone">
            <Input id="lead-phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} disabled={createLead.isPending} autoComplete="tel" />
          </Field>
          <Field label="Company" htmlFor="lead-company" required>
            <Input id="lead-company" value={form.company} onChange={(event) => updateField('company', event.target.value)} disabled={createLead.isPending} autoComplete="organization" />
          </Field>
          <Field label="Role" htmlFor="lead-role">
            <Input id="lead-role" value={form.role} onChange={(event) => updateField('role', event.target.value)} disabled={createLead.isPending} />
          </Field>
          <Field label="Source" htmlFor="lead-source">
            <Select id="lead-source" value={form.source} onChange={(event) => updateField('source', event.target.value)} disabled={createLead.isPending} options={sourceOptions} />
          </Field>
          <Field label="Status" htmlFor="lead-status">
            <Select id="lead-status" value={form.status} onChange={(event) => updateStatus(event.target.value, updateField)} disabled={createLead.isPending} options={leadStatusOptions} />
          </Field>
          <Field label="Estimated value" htmlFor="lead-estimated-value">
            <Input id="lead-estimated-value" inputMode="decimal" value={form.estimatedValue} onChange={(event) => updateField('estimatedValue', event.target.value)} disabled={createLead.isPending} />
          </Field>
          <Field label="Tags" htmlFor="lead-tags">
            <Input id="lead-tags" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} disabled={createLead.isPending} placeholder="enterprise, priority" />
          </Field>
        </div>

        {formError ? <div className="rounded-md border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">{formError}</div> : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="subtle" onClick={() => setOpen(false)} disabled={createLead.isPending}>Cancel</Button>
          <Button type="submit" disabled={createLead.isPending}>{createLead.isPending ? 'Creating lead...' : 'Create lead'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, htmlFor, required, children }: { label: string; htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="space-y-2 text-sm text-graphite-200">
      <span className="flex items-center gap-1 font-medium text-white">
        {label}
        {required ? <span className="text-gold-200" aria-label="required">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function updateStatus(value: string, updateField: (field: keyof LeadFormState, value: string) => void) {
  if (isLeadStatus(value)) updateField('status', value);
}

function isLeadStatus(value: string): value is LeadStatus {
  return value === 'new' || value === 'assigned' || value === 'qualified' || value === 'nurture' || value === 'converted' || value === 'disqualified';
}
