import type { AuthUser } from '@/types/auth';
import type { ShopSettings } from './shop-types';

export function ShopHelp() {
  return <section className="shop-panel"><div className="shop-panel-head"><div><h2>Your everyday workflow</h2><p>Every number starts with a saved record.</p></div></div><div className="nx-help-grid">{[
    ['01', 'Set up your workspace', 'Choose your currency. Add products with opening quantity and unit cost.'],
    ['02', 'Build relationships', 'Save leads and contacts. Schedule follow-ups and mark completed conversations.'],
    ['03', 'Record a sale', 'Create a draft, then complete it. Stock and recognized revenue update together.'],
    ['04', 'Keep money in sync', 'Record full or partial payments. Returns and refunds preserve the original records.'],
    ['05', 'See the full picture', 'Choose your reporting period. Review revenue, costs, profit and cash separately. Export exact values.'],
    ['06', 'Understand availability', 'Unavailable modules are hidden in this retail release. Bank transfers, supplier cash flows, tax and AI forecasts are not provided.'],
  ].map(([number, title, detail]) => <section key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></section>)}</div><p className="nx-support-note">For technical or account help, contact your workspace administrator. No external support service is connected.</p></section>;
}

export function ShopProfile({ user, settings, busy, onSettings, onLogout }: { user: AuthUser | null; settings?: ShopSettings; busy: boolean; onSettings: () => void; onLogout: () => void }) {
  return <section className="shop-panel"><div className="shop-panel-head"><div><h2>Your profile</h2><p>Details from your signed-in account.</p></div></div><dl className="shop-identity"><dt>Name</dt><dd>{user?.name}</dd><dt>Email</dt><dd>{user?.email}</dd><dt>Business</dt><dd>{settings?.organizationName ?? '—'}</dd><dt>Business ID</dt><dd className="shop-mono">{settings?.tenantId ?? '—'}</dd><dt>Access roles</dt><dd>{user?.roles.join(', ') || '—'}</dd></dl><div className="nx-profile-actions"><button type="button" className="shop-btn" onClick={onSettings}>Workspace settings</button><button type="button" className="shop-btn" disabled={busy} onClick={onLogout}>Sign out</button></div></section>;
}
