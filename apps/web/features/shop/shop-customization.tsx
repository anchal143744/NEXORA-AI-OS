'use client';

import { FormEvent, useState } from 'react';
import { apiRequest } from '@/lib/api-client';
import { moduleOptions, widgetOptions, type ShopPreferences } from './shop-preferences';

export function ShopCustomization({ preferences, onSaved }: { preferences: ShopPreferences; onSaved: () => Promise<void> }) {
  const [pending, setPending] = useState(false); const [error, setError] = useState('');
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(''); const form = new FormData(event.currentTarget);
    try { await apiRequest('/v1/retail/shop/preferences', { method: 'PATCH', body: { expectedVersion: preferences.version, modules: form.getAll('modules'), widgets: form.getAll('widgets') } }); await onSaved(); }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'Unable to save preferences.'); }
    finally { setPending(false); }
  }
  return <section className="shop-panel nx-customization"><div className="shop-panel-head"><div><h2>Shape your workspace</h2><p>Choose what your organization sees in navigation and on the overview.</p></div></div><form className="shop-form" onSubmit={save}><fieldset><legend>Navigation modules</legend><p>Workspace and Administration remain available. Hiding a module keeps its records and permissions intact.</p><div className="nx-preference-options">{moduleOptions.map(option => <label key={option.key}><input type="checkbox" name="modules" value={option.key} defaultChecked={preferences.modules.includes(option.key)} /><span>{option.label}</span></label>)}</div></fieldset><fieldset><legend>Dashboard widgets</legend><p>Headline financial cards remain visible. Choose the detail panels that help your business.</p><div className="nx-preference-options">{widgetOptions.map(option => <label key={option.key}><input type="checkbox" name="widgets" value={option.key} defaultChecked={preferences.widgets.includes(option.key)} /><span>{option.label}</span></label>)}</div></fieldset><p className="shop-form-note">These settings apply to this workspace. They do not activate unavailable features or grant access. Saving requires workspace management permission.</p>{error && <div className="shop-error" role="alert">{error}</div>}<button className="shop-btn shop-primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save workspace preferences'}</button></form></section>;
}
