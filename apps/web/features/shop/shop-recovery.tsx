'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import {useQueryClient} from '@tanstack/react-query';
import {useAuthStore} from '@/stores/auth-store';
import { apiRequest } from '@/lib/api-client';
import { ShopBrand } from './shop-auth';
import './shop.css';
import './shop-theme.css';
import './shop-executive.css';

export function ShopRecovery() {
  const client=useQueryClient();const clearSession=useAuthStore(state=>state.clearSession);
  const [mode,setMode] = useState<'request'|'reset'|'verify'>('request');
  const [busy,setBusy] = useState(false),[error,setError] = useState(''),[notice,setNotice] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');setNotice('');const element=event.currentTarget;const form=new FormData(element);
    if(mode==='reset' && form.get('password')!==form.get('confirmation')){setError('Passwords do not match.');return;}
    setBusy(true);
    try {
      const tenantId=String(form.get('tenantId')).trim();
      await apiRequest(`/v1/auth/${mode==='request'?'forgot-password':mode==='reset'?'reset-password':'email/verify'}`,{method:'POST',body:mode==='request'?{tenantId,email:String(form.get('email')).trim().toLowerCase()}:mode==='reset'?{tenantId,token:String(form.get('token')).trim(),newPassword:String(form.get('password'))}:{tenantId,token:String(form.get('token')).trim()}});
      if(mode==='reset'){await client.cancelQueries();client.clear();clearSession();}
      setNotice(mode==='request'?'If this account exists, a reset request has been accepted. Check your email for the token.':mode==='reset'?'Password reset. Sign in with your new password; old sessions have been revoked.':'Email verified. Sign in to refresh your account details.');
      element.reset();
    } catch(issue){setError(issue instanceof Error?issue.message:'Unable to complete account recovery.');}finally{setBusy(false);}
  }
  return <main id="main-content" className="shop-root shop-auth"><section className="shop-auth-story"><ShopBrand/><div><span className="shop-eyebrow">ACCOUNT SECURITY</span><h1>Get back to<br/>your business.</h1><p>Use the token sent to your own email. NEXORA never asks you to share passwords or reset tokens with support.</p></div></section><section className="shop-auth-form"><div className="shop-auth-form-inner"><h2>{mode==='request'?'Recover your account':mode==='reset'?'Set a new password':'Verify your email'}</h2><p>Your business ID is shown in Profile and identifies your private account.</p><div className="shop-row-actions">{(['request','reset','verify'] as const).map(item=><button key={item} type="button" className="shop-text-btn" disabled={busy} aria-pressed={item===mode} onClick={()=>{setMode(item);setError('');setNotice('');}}>{item==='request'?'Request reset':item==='reset'?'Use reset token':'Verify email'}</button>)}</div><form onSubmit={submit} key={mode}><label>Business ID<input name="tenantId" required pattern="[0-9a-fA-F-]{36}" autoComplete="off"/></label>{mode==='request'?<label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200}/></label>:<label>Email token<textarea name="token" autoComplete="off" required maxLength={5000}/></label>}{mode==='reset'&&<><label>New password<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={256}/></label><label>Confirm password<input name="confirmation" type="password" autoComplete="new-password" required minLength={12} maxLength={256}/></label></>}{error&&<p className="shop-error" role="alert">{error}</p>}{notice&&<p className="shop-notice" role="status">{notice}</p>}<button className="shop-btn shop-primary" disabled={busy}>{busy?'Please wait…':mode==='request'?'Send reset email':mode==='reset'?'Reset password':'Verify email'}</button></form><p className="shop-auth-switch"><Link href="/login">Back to sign in</Link></p></div></section></main>;
}
