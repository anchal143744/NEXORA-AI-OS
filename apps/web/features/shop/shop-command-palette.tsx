'use client';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import {canShopAction} from './shop-action-permissions';
import type { Customer, PageResult, Product, Sale } from './shop-types';
import type { ShopView } from './shop-navigation';
import type { ShopModal } from './shop-forms';

type Result = { id: string; label: string; detail: string; view: ShopView; search: string };
export async function searchWorkspace(query: string, signal?: AbortSignal, capabilities?: Record<string,boolean>) {
  const term = encodeURIComponent(query.trim());
  const responses = await Promise.allSettled([
    capabilities && capabilities.crm !== true ? Promise.resolve({items:[]}) : apiRequest<PageResult<Customer>>(`/v1/retail/shop/customers?limit=5&search=${term}`, { signal }),
    capabilities && capabilities.inventory !== true ? Promise.resolve({items:[]}) : apiRequest<PageResult<Product>>(`/v1/retail/shop/products?limit=5&search=${term}`, { signal }),
    capabilities && capabilities.sales !== true ? Promise.resolve({items:[]}) : apiRequest<PageResult<Sale>>(`/v1/retail/shop/sales?limit=5&search=${term}`, { signal }),
  ]);
  if (responses.every(response => response.status === 'rejected')) throw (responses[0] as PromiseRejectedResult).reason;
  const results: Result[] = [];
  const [customers, products, sales] = responses;
  if (customers.status === 'fulfilled') for (const record of customers.value.items) results.push({ id: 'customer:' + record.id, label: record.name, detail: 'Customer / lead', view: 'customers', search: record.name });
  if (products.status === 'fulfilled') for (const record of products.value.items) results.push({ id: 'product:' + record.id, label: record.name, detail: 'Product · ' + record.sku, view: 'inventory', search: record.sku });
  if (sales.status === 'fulfilled') for (const record of sales.value.items) results.push({ id: 'sale:' + record.id, label: 'Order ' + record.saleKey.slice(0, 8), detail: 'Invoice · ' + record.invoice.invoiceNumber, view: 'sales', search: record.saleKey });
  return { results, partial: responses.some(response => response.status === 'rejected') };
}

export function ShopCommandPalette({ open, onClose, scopeKey, enabled, capabilities, onNavigate, onCreate }: { open: boolean; onClose: () => void; scopeKey: (string | undefined)[]; enabled: boolean; capabilities?: Record<string,boolean>; onNavigate: (view: ShopView, label?: string, search?: string) => void; onCreate: (modal: ShopModal) => void }) {
  const dialog = useRef<HTMLDialogElement>(null); const [term, setTerm] = useState(''); const [debounced, setDebounced] = useState('');
  useEffect(() => { const timer = setTimeout(() => setDebounced(term.trim()), 250); return () => clearTimeout(timer); }, [term]);
  useEffect(() => { if (open && !dialog.current?.open) dialog.current?.showModal(); if (!open && dialog.current?.open) dialog.current.close(); }, [open]);
  const search = useQuery({ queryKey: [...scopeKey, 'global-search', debounced, capabilities?.crm, capabilities?.inventory, capabilities?.sales], queryFn: ({ signal }) => searchWorkspace(debounced, signal, capabilities), enabled: open && enabled && debounced.length >= 2, staleTime: 0, gcTime: 0, retry: false });
  function create(modal: ShopModal) { if(!canShopAction(modal,capabilities))return;onClose(); onCreate(modal); }
  function navigate(view: ShopView, text?: string) { onClose(); onNavigate(view, undefined, text); }
  return <dialog ref={dialog} className="shop-root nx-command-dialog" aria-labelledby="nx-command-heading" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="nx-command-inner"><div className="nx-command-search"><Search size={20} /><label className="sr-only" htmlFor="nx-command-input">Search customers, products, orders and invoices</label><input id="nx-command-input" autoFocus maxLength={100} placeholder="Search customers, products, orders, invoices…" value={term} onChange={event => setTerm(event.target.value)} /><button className="shop-icon-btn" aria-label="Close search" onClick={onClose}><X size={19} /></button></div><h2 id="nx-command-heading">Search & quick actions</h2>
    {debounced.length >= 2 && <div className="nx-command-results">{search.isFetching ? <p role="status">Searching authorized records…</p> : search.error ? <p role="alert">{search.error.message}</p> : search.data?.results.length ? search.data.results.map(result => <button key={result.id} onClick={() => navigate(result.view, result.search)}><span><strong>{result.label}</strong><small>{result.detail}</small></span><ArrowUpRight size={16} /></button>) : <p>No matching authorized records.</p>}{search.data?.partial && <p>Some sources are unavailable or not permitted. Results shown are from successful sources.</p>}</div>}
    <div className="nx-command-actions"><span>QUICK ACTIONS</span><button disabled={!enabled || !canShopAction({kind:'customer'},capabilities)} onClick={() => create({ kind: 'customer', initialStage: 'lead' })}>Create lead</button><button disabled={!enabled || !canShopAction({kind:'customer'},capabilities)} onClick={() => create({ kind: 'customer' })}>Create customer</button><button disabled={!enabled || !canShopAction({kind:'product'},capabilities)} onClick={() => create({ kind: 'product' })}>Add product</button><button disabled={!enabled || !canShopAction({kind:'sale'},capabilities)} onClick={() => create({ kind: 'sale' })}>Create order & invoice</button><button disabled={!enabled || !canShopAction({kind:'expense'},capabilities)} onClick={() => create({ kind: 'expense' })}>Record expense</button><button disabled={!enabled || capabilities?.finance !== true} onClick={() => navigate('reports')}>Open financial reports</button><button disabled title="No AI provider or safe execution workflow is configured">AI assistant · not connected</button></div><footer>Ctrl / ⌘ K to open · Esc to close · Suppliers and standalone transaction search are not connected.</footer></div></dialog>;
}
