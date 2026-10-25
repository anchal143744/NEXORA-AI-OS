'use client';
import { FormEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
export function ShopSecurityPanel() {
  const { user, session, clearSession } = useAuthStore(); const client = useQueryClient();
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); const form = new FormData(event.currentTarget);
    if (form.get('newPassword') !== form.get('confirmPassword')) { setError('New passwords do not match.'); return; }
    setBusy(true);
    try { await apiRequest('/v1/auth/password/change', { method:'POST', body: { tenantId: session?.tenantId, userId: user?.id, currentPassword: String(form.get('currentPassword')), newPassword: String(form.get('newPassword')) } }); await client.cancelQueries(); client.clear(); clearSession(); }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'Unable to change password'); } finally { setBusy(false); }
  }
  return <section className="shop-panel"><div className="shop-panel-head"><div><h2>Account security</h2><p>Changing your password signs out all current sessions.</p></div></div><form className="shop-form nx-security-form" onSubmit={submit}><label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required maxLength={256} /></label><label>New password<input name="newPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={256} /></label><label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={256} /></label>{error && <div className="shop-error" role="alert">{error}</div>}<button className="shop-btn shop-primary" disabled={busy}>{busy ? 'Updating…' : 'Change password & sign out'}</button><p className="shop-form-note">Passwords are hashed on the server. Email delivery and recovery require a configured, verified mail provider; no email delivery is claimed in this local setup.</p></form></section>;
}
