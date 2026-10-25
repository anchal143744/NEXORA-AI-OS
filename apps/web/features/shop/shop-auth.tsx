'use client';
import { FormEvent, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Package, ReceiptText, Users } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthResponse } from '@/types/auth';

export function ShopBrand() { return <span className="shop-brand"><span className="shop-brand-mark"><svg width="23" height="23" viewBox="0 0 256 256" aria-hidden="true"><path d="M58 196V60h34l72 89V60h34v136h-34L92 107v89Z" fill="currentColor" /></svg></span><span>nexora<span className="shop-brand-dot">.</span></span></span>; }
export function ShopAuth() {
  const router = useRouter(); const pathname = usePathname(); const signup = pathname === '/signup';
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const setSession = useAuthStore(state => state.setSession);
  const queryClient = useQueryClient();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setPending(true);
    const data = new FormData(event.currentTarget);
    if (signup && data.get('password') !== data.get('confirmPassword')) { setError('Passwords do not match.'); setPending(false); return; }
    const body = signup ? { requestKey, name: String(data.get('name')), email: String(data.get('email')).trim().toLowerCase(), password: String(data.get('password')) } : { email: String(data.get('email')).trim().toLowerCase(), password: String(data.get('password')), ...(data.get('tenantId') ? { tenantId: String(data.get('tenantId')).trim() } : {}) };
    // ShopWorkspace owns the authenticated redirect. Starting a second router
    // transition here can race its unmount immediately after setSession.
    try { const result = await apiRequest<AuthResponse>(`/v1/auth/${signup ? 'signup' : 'login'}`, { method: 'POST', body: { ...body, sessionTransport: 'cookie' } }); queryClient.clear(); setSession(result.user, result.session); }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'Unable to sign in. Please try again.'); }
    finally { setPending(false); }
  }
  return <main id="main-content" className="shop-auth">
    <section className="shop-auth-story">
      <ShopBrand />
      <div><span className="shop-eyebrow">YOUR SHOP. CONNECTED.</span><h1>Less busywork.<br />More business.</h1><p>Keep your customers, stock and money in one clear view. Built for the work that happens every day.</p>
        <div className="shop-auth-features"><span><Users size={19} /> Customers & follow-ups</span><span><Package size={19} /> Stock & sales</span><span><ReceiptText size={19} /> Payments & profit</span></div>
      </div>
      <p className="shop-auth-foot"><LockKeyhole size={15} /> Your business has its own private workspace.</p>
    </section>
    <section className="shop-auth-form"><div className="shop-auth-form-inner">
      <span className="shop-eyebrow">NEXORA RETAIL WORKSPACE</span><h2>{signup ? 'A fresh start for your shop.' : 'Good to have you back.'}</h2><p>{signup ? 'Create your account, then configure your own business before opening its dashboard.' : 'Sign in to pick up where you left off.'}</p>
      <form onSubmit={submit} onChange={() => { if (!pending) setRequestKey(crypto.randomUUID()); }} key={String(signup)}>
        {signup && <><label>Your name<input name="name" autoComplete="name" required maxLength={120} placeholder="Your full name" /></label></>}
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@yourbusiness.com" /></label>
        <label>Password<input name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 12 : 1} maxLength={256} placeholder={signup ? 'At least 12 characters' : 'Your password'} /></label>
        {signup && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={256} placeholder="Enter your password again" /></label>}
        {!signup && <details className="shop-org-login"><summary>Use a business ID</summary><label>Business ID <small>Only needed for separate accounts using the same email.</small><input name="tenantId" placeholder="Your saved business ID" /></label></details>}
        {error && <div role="alert" className="shop-error">{error}</div>}
        <button className="shop-btn shop-primary" type="submit" disabled={pending}>{pending ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}<ArrowRight size={17} /></button>
      </form>
      <p className="shop-auth-switch">{signup ? 'Already have an account?' : 'New to NEXORA?'} <button type="button" onClick={() => { router.push(signup ? '/login' : '/signup'); setError(''); }}>{signup ? 'Sign in' : 'Create an account'}</button></p>
      {!signup && <p className="shop-auth-switch"><Link href="/recover">Forgot password or verify email</Link></p>}
      <p className="shop-muted shop-auth-note">Start with your own records. No sample balances or prefilled customer data.</p>
    </div></section>
  </main>;
}
