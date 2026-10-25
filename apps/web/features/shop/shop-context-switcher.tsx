'use client';
import { FormEvent, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, ChevronDown, Plus, X } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthResponse } from '@/types/auth';
type Context = { organizationId: string; organizationName: string; workspaceId: string; workspaceName: string; canManage: boolean };
export function ShopContextSwitcher() {
  const { user, session, setSession } = useAuthStore(); const client = useQueryClient();
  const [busy,setBusy] = useState(false), [error,setError] = useState(''); const dialog = useRef<HTMLDialogElement>(null);
  const [kind,setKind] = useState<'business' | 'workspace'>('business'); const [requestKey,setRequestKey] = useState('');
  const contexts = useQuery({ queryKey: ['auth-contexts', session?.tenantId, user?.id], queryFn: ({ signal }) => apiRequest<Context[]>('/v1/auth/contexts', { signal }), retry: false });
  const current = contexts.data?.find(row => row.workspaceId === session?.workspaceId);
  async function switchTo(workspaceId: string) {
    setBusy(true); setError('');
    await client.cancelQueries(); useAuthStore.getState().setScopeError(''); useAuthStore.getState().setScopeTransition(true);
    try { const original = useAuthStore.getState().session?.id; const next = await apiRequest<AuthResponse>('/v1/auth/switch-context', { method: 'POST', body: { workspaceId, sessionTransport: 'cookie' } }); if (useAuthStore.getState().session?.id !== original) throw new Error('Account changed. Sign in again before switching.'); await client.cancelQueries(); client.clear(); setSession(next.user,next.session); }
    catch (issue) { useAuthStore.getState().setScopeError(issue instanceof Error ? issue.message : 'Unable to switch workspace'); } finally { useAuthStore.getState().setScopeTransition(false); setBusy(false); }
  }
  function openCreate() { setError(''); setRequestKey(crypto.randomUUID()); dialog.current?.showModal(); }
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); const form = new FormData(event.currentTarget);
    try { const result = await apiRequest<{workspaceId:string}>('/v1/auth/contexts', { method: 'POST', body: { name: String(form.get('name')), kind, requestKey } }); await client.invalidateQueries({ queryKey: ['auth-contexts'] }); dialog.current?.close(); await switchTo(result.workspaceId); }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'Unable to create workspace'); } finally { setBusy(false); }
  }
  return <div className="nx-context-switcher"><Building2 size={17} /><label className="sr-only" htmlFor="nx-context-select">Business and workspace</label><select id="nx-context-select" aria-label="Business and workspace" value={session?.workspaceId ?? ''} disabled={busy || contexts.isPending || Boolean(contexts.error)} onChange={event => void switchTo(event.target.value)}>{contexts.data?.map(row => <option key={row.workspaceId} value={row.workspaceId}>{row.organizationName} · {row.workspaceName}</option>) ?? <option value={session?.workspaceId ?? ''}>Loading workspace…</option>}</select><ChevronDown size={12} />{current?.canManage && <button className="shop-icon-btn" aria-label="Add business or workspace" onClick={openCreate} disabled={busy}><Plus size={15} /></button>}{(error || contexts.error) && <p className="nx-context-error" role="alert">{error || contexts.error?.message}</p>}<dialog ref={dialog} className="shop-dialog nx-context-dialog" onCancel={() => setError('')}><div className="shop-dialog-head"><h2>Add your next business context</h2><button className="shop-icon-btn" aria-label="Close" disabled={busy} onClick={() => dialog.current?.close()}><X size={18} /></button></div><form className="shop-form" onSubmit={create}><label>Create<select value={kind} onChange={event => {setKind(event.target.value as typeof kind);setRequestKey(crypto.randomUUID());}}><option value="business">Separate business in your account</option><option value="workspace">Workspace in the current business</option></select></label><label>Name<input name="name" required maxLength={100} /></label><p className="shop-form-note">The new workspace starts empty and requires business setup. Other tenants are never available through this switcher.</p>{error && <div className="shop-error" role="alert">{error}</div>}<button className="shop-btn shop-primary" disabled={busy}>{busy ? 'Creating…' : 'Create & configure'}</button></form></dialog></div>;
}
