'use client';

import { useEffect, useRef, useState } from 'react';
import { BarChart3, Boxes, ChevronDown, CircleHelp, Star, CreditCard, LayoutDashboard, Settings2, ShieldCheck, ShoppingBag, Users, Workflow, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ShopBrand } from './shop-auth';

export type ShopView = 'overview' | 'customers' | 'followups' | 'inventory' | 'sales' | 'expenses' | 'reports' | 'settings' | 'help' | 'profile';
type Entry = { key?: string; label: string; view?: ShopView; search?: string; hint?: string };
type Section = { key: string; label: string; icon: LucideIcon; branches: Entry[] };
export const shopNavigation: Section[] = [
  { key: 'workspace', label: 'Workspace', icon: LayoutDashboard, branches: [{ label: 'Overview', view: 'overview' }, { label: 'AI Command Center' }, { label: 'My Tasks' }, { label: 'Notifications' }] },
  { key: 'crm', label: 'CRM', icon: Users, branches: [{ label: 'Leads', view: 'customers' }, { label: 'Contacts', view: 'customers' }, { label: 'Companies' }, { label: 'Deals' }, { label: 'Follow-ups', view: 'followups' }] },
  { key: 'sales', label: 'Sales', icon: ShoppingBag, branches: [{ label: 'Quotes' }, { label: 'Orders', view: 'sales' }, { label: 'Invoices', view: 'sales', hint: 'Linked invoices and balances in the sales ledger' }, { label: 'Payments', view: 'sales', hint: 'Record payments and open payment history on a sale' }, { label: 'Returns', view: 'sales', search: 'returned' }] },
  { key: 'inventory', label: 'Inventory', icon: Boxes, branches: [{ label: 'Products', view: 'inventory' }, { label: 'Stock Levels', view: 'inventory' }, { label: 'Stock Movements', view: 'inventory', hint: 'Open movement history on a product' }, { label: 'Warehouses' }, { label: 'Transfers' }, { label: 'Purchase Orders' }, { label: 'Suppliers' }] },
  { key: 'finance', label: 'Finance', icon: CreditCard, branches: [{ key: 'finance-overview', label: 'Financial Overview', view: 'overview' }, { label: 'Income & Expenses', view: 'expenses' }, { label: 'Profit & Loss', view: 'reports' }, { label: 'Cash Flow' }, { label: 'Receivables' }, { label: 'Payables' }] },
  { key: 'operations', label: 'Operations', icon: Workflow, branches: [{ label: 'Workflows' }, { label: 'Approvals' }, { label: 'Integrations' }] },
  { key: 'intelligence', label: 'Intelligence', icon: BarChart3, branches: [{ label: 'Analytics & Reports', view: 'reports' }, { label: 'AI Insights' }, { label: 'Forecasts' }] },
  { key: 'administration', label: 'Administration', icon: Settings2, branches: [{ label: 'Team & Members' }, { label: 'Roles & Permissions' }, { label: 'Organization Settings', view: 'settings' }, { label: 'Workspace Settings', view: 'settings' }, { label: 'Billing & Plans' }] },
];

export function ShopNavigation({ active, open, organization, modules, capabilities, storageKey, onNavigate, onClose }: { active: string; open: boolean; organization: string; modules?: string[]; capabilities?: Record<string, boolean>; storageKey?: string; onNavigate: (view: ShopView, label: string, search?: string, key?: string) => void; onClose: () => void }) {
  const load = (key: string, fallback: string[]) => { try { if (typeof window === 'undefined' || !storageKey) return fallback; const raw = JSON.parse(window.localStorage.getItem('nexora.navigation:' + storageKey + ':' + key) ?? 'null'); return Array.isArray(raw) && raw.every(item => typeof item === 'string') ? raw.slice(0, 30) : fallback; } catch { return fallback; } };
  const [expanded, setExpanded] = useState<string[]>(() => load('expanded', ['workspace', 'crm', 'sales', 'inventory', 'finance']));
  const [pins, setPins] = useState<string[]>(() => load('pins', []));
  useEffect(() => { if (!storageKey) return; try { window.localStorage.setItem('nexora.navigation:' + storageKey + ':expanded', JSON.stringify(expanded)); window.localStorage.setItem('nexora.navigation:' + storageKey + ':pins', JSON.stringify(pins)); } catch {} }, [expanded, pins, storageKey]);
  const sections = shopNavigation.filter(section => !modules || ['workspace', 'administration'].includes(section.key) || modules.includes(section.key)).map(section => ({ ...section, branches: section.branches.filter(entry => entry.view && (section.key === 'workspace' || !capabilities || capabilities[section.key === 'intelligence' ? 'finance' : section.key === 'administration' ? 'settings' : section.key] !== false)) })).filter(section => section.branches.length);
  const pinnable = sections.flatMap(section => section.branches); const current = pinnable.find(entry => (entry.key ?? entry.label) === active);
  function pinCurrent() { if (!current) return; setPins(items => items.includes(active) ? items.filter(key => key !== active) : [...items, active]); }
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = shopNavigation.find(item => item.branches.some(entry => (entry.key ?? entry.label) === active));
    if (section) setExpanded(items => items.includes(section.key) ? items : [...items, section.key]);
  }, [active]);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []).filter(element => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const elements = focusable(); const first = elements[0]; const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keydown); if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus(); };
  }, [open, onClose]);
  function toggle(label: string) { setExpanded(items => items.includes(label) ? items.filter(item => item !== label) : [...items, label]); }
  function item(entry: Entry, Icon?: LucideIcon) {
    return <button key={entry.key ?? entry.label} type="button" className={`nx-nav-item ${Icon ? '' : 'nx-nav-child'} ${active === (entry.key ?? entry.label) ? 'is-active' : ''}`} aria-current={active === (entry.key ?? entry.label) ? 'page' : undefined} disabled={!entry.view} title={entry.view ? entry.hint : 'Not available in this retail release'} onClick={() => entry.view && onNavigate(entry.view, entry.label, entry.search, entry.key)}>
      {Icon ? <Icon size={17} strokeWidth={1.65} /> : <span className="nx-nav-node" />}<span>{entry.label}</span>{!entry.view && <span className="nx-planned" aria-label="Not available">Soon</span>}
    </button>;
  }
  return <aside ref={panel} className={`shop-sidebar nx-sidebar ${open ? 'is-open' : ''}`}>
    <div className="nx-sidebar-brand"><ShopBrand /><button type="button" className="shop-icon-btn shop-mobile" aria-label="Close navigation" onClick={onClose}><X size={20} /></button></div>
    <div className="nx-business"><span>{organization.slice(0, 1).toUpperCase()}</span><div><strong>{organization}</strong><small>Retail workspace</small></div><ShieldCheck size={15} /></div>
    <div className="nx-pin-current"><button className="shop-text-btn" type="button" disabled={!current} onClick={pinCurrent}><Star size={13} />{pins.includes(active) ? 'Unpin page' : 'Pin current page'}</button></div>
    <nav className="nx-nav-scroll" aria-label="Main navigation">{pins.some(key => pinnable.some(entry => (entry.key ?? entry.label) === key)) && <section className="nx-pinned-pages"><span>PINNED</span>{pins.map(key => { const entry = pinnable.find(item => (item.key ?? item.label) === key); return entry ? item(entry, Star) : null; })}</section>}{sections.map((section, index) => <section className="nx-nav-section" key={section.key}>
      {(() => { const group = (key: string) => ['crm', 'sales'].includes(key) ? 'CUSTOMERS & SALES' : ['inventory', 'finance'].includes(key) ? 'OPERATIONS' : key === 'intelligence' ? 'INTELLIGENCE' : key === 'administration' ? 'ADMINISTRATION' : 'WORKSPACE'; const label = group(section.key); return index === 0 || group(sections[index - 1].key) !== label ? <div className="nx-nav-group-label">{label}</div> : null; })()}
      <button type="button" className="nx-section-toggle" aria-expanded={expanded.includes(section.key)} aria-controls={`nx-section-${section.key}`} onClick={() => toggle(section.key)}><section.icon size={16} strokeWidth={1.6} /><span>{section.label}</span><ChevronDown size={12} className={expanded.includes(section.key) ? 'is-expanded' : ''} /></button>
      <div id={`nx-section-${section.key}`} className="nx-nav-children" hidden={!expanded.includes(section.key)}>{section.branches.map(entry => item(entry))}</div>
    </section>)}</nav>
    <div className="nx-sidebar-bottom">{item({ label: 'Help & Support', view: 'help' }, CircleHelp)}{capabilities?.settings !== false && item({ label: 'Preferences', view: 'settings' }, Settings2)}{item({ label: 'Profile', view: 'profile' }, Users)}<p><span /> Private organization workspace</p></div>
  </aside>;
}
