'use client';

import { Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function ContactManagement() {
  const contacts = useCrmWorkspaceStore((state) => state.contacts);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Management</CardTitle>
        <CardDescription>Profiles, communication history, notes, tags and segmentation.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {contacts.length === 0 ? (
          <EmptyState className="xl:col-span-3" icon={Mail} title="No contacts yet" description="Customer contacts appear here after customers are created or imported from CRM data." />
        ) : null}
        {contacts.map((contact) => (
          <article key={contact.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="text-base font-semibold text-white">{contact.name}</div>
            <div className="mt-1 text-sm text-graphite-300">{contact.title} at {contact.company}</div>
            <div className="mt-3 space-y-2 text-xs text-graphite-300">
              <div className="flex items-center gap-2"><Mail className="size-3 text-gold-200" />{contact.email}</div>
              <div className="flex items-center gap-2"><Phone className="size-3 text-gold-200" />{contact.phone}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{contact.segment}</Badge>
              {contact.tags.map((tag) => <Badge key={tag} variant="neutral">{tag}</Badge>)}
            </div>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{contact.notes}</p>
            <div className="mt-3 rounded-md border border-white/10 bg-graphite-950/60 p-3">
              <div className="text-xs font-semibold text-white">Communication history</div>
              <ul className="mt-2 space-y-1 text-xs text-graphite-400">
                {contact.communicationHistory.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
