import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadWebModule} from './helpers/web-contracts.mjs';

test('authentication route transitions wait before mounting workspace or sign-in forms',()=>{
  for(const [pathname,status]of [['/login','authenticated'],['/signup','authenticated'],['/dashboard','anonymous'],['/business-setup','anonymous']]){
    const {ShopWorkspace}=loadWebModule('features/shop/shop-workspace.tsx',{
      'next/navigation':{usePathname:()=>pathname,useRouter:()=>({replace(){}})},
      '@/stores/auth-store':{useAuthStore:()=>({hydrated:true,status,scopeTransition:false})},
      '@tanstack/react-query':{useQueryClient(){throw new Error('Workspace mounted before authentication navigation completed');}},
    });
    const html=renderToStaticMarkup(React.createElement(ShopWorkspace));
    assert.match(html,/role="status"/);assert.match(html,/Opening your workspace/);assert.doesNotMatch(html,/Main navigation|Create account|Sign in/);
  }
});

test('setup/dashboard route transitions hide forms until the canonical route is mounted',()=>{
  for(const [pathname,setupComplete]of [['/business-setup',true],['/dashboard',false]]){
    const state={hydrated:true,status:'authenticated',user:{id:'synthetic'},session:{tenantId:'t',workspaceId:'w'}};
    const settings={currency:'INR',precision:2,setupComplete,capabilities:{},preferences:{version:0,modules:[],widgets:[]}};
    const {ShopWorkspace}=loadWebModule('features/shop/shop-workspace.tsx',{
      'next/navigation':{usePathname:()=>pathname,useRouter:()=>({replace(){}})},
      '@/stores/auth-store':{useAuthStore:()=>state},
      '@tanstack/react-query':{useQueryClient:()=>({}),useQuery:({queryKey})=>({data:queryKey.includes('settings')?settings:undefined})},
    });
    const html=renderToStaticMarkup(React.createElement(ShopWorkspace));
    assert.match(html,/role="status"/);assert.match(html,/Opening your workspace/);assert.doesNotMatch(html,/Main navigation|Save &amp; open dashboard/);
  }
});

test('auth persistence never writes access or refresh credentials to local storage', t => {
  const previous=globalThis.window; const values=new Map(); globalThis.window={localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
  t.after(()=>{if(previous===undefined)delete globalThis.window;else globalThis.window=previous;});
  const {useAuthStore,AUTH_STORAGE_KEY}=loadWebModule('stores/auth-store.ts');
  const user={id:'user',email:'owner@example.invalid',name:'Actual owner',roles:['Organization Owner']};
  useAuthStore.getState().setSession(user,{id:'sid',tenantId:'tenant',workspaceId:'workspace',accessToken:'sensitive-access',refreshToken:'sensitive-refresh'});
  assert.equal(useAuthStore.getState().session.accessToken,'sensitive-access');
  assert.doesNotMatch(values.get(AUTH_STORAGE_KEY),/sensitive-access|sensitive-refresh|accessToken|refreshToken/);
  values.set(AUTH_STORAGE_KEY,JSON.stringify({user,session:{accessToken:'forged',refreshToken:'legacy',tenantId:'other'}}));
  useAuthStore.getState().hydrateFromStorage();
  assert.equal(useAuthStore.getState().status,'unknown');assert.equal(useAuthStore.getState().session,null);assert.equal(useAuthStore.getState().hydrated,false);
  assert.doesNotMatch(values.get(AUTH_STORAGE_KEY),/forged|legacy|accessToken|refreshToken/);
});

test('business setup renders saved context and required user choices without demo balances', () => {
  const {ShopBusinessSetup}=loadWebModule('features/shop/shop-business-setup.tsx',{'./shop-context-switcher':{ShopContextSwitcher:()=>null},'./shop-auth':{ShopBrand:()=>React.createElement('span',null,'NEXORA')}});
  const settings={name:'Owner chosen workspace',organizationName:'Owner chosen business',workspaceId:'w',preferences:{version:0,modules:['crm'],widgets:[]},currency:null,capabilities:{owner:true}};
  const html=renderToStaticMarkup(React.createElement(ShopBusinessSetup,{settings,onSaved(){},onLogout(){}}));
  for(const name of ['businessName','name','category','countryCode','timeZone','currency'])assert.ok(html.includes(`name="${name}"`),name);
  assert.match(html,/Owner chosen business/);assert.match(html,/Save &amp; open dashboard/);assert.doesNotMatch(html,/Anchal|4,85,000/);
  const denied=renderToStaticMarkup(React.createElement(ShopBusinessSetup,{settings:{...settings,capabilities:{owner:false}},onSaved(){},onLogout(){}}));
  assert.match(denied,/Ask the organization owner/);assert.doesNotMatch(denied,/name="businessName"/);
});

test('financial date labels remain UTC and follow-up dates can use the saved timezone', () => {
  const {dateLabel}=loadWebModule('features/shop/shop-types.ts');
  assert.equal(dateLabel('2026-10-31T23:59:59Z'),'31 Oct 2026');
  assert.equal(dateLabel('2026-10-31T23:59:59Z','Asia/Kolkata'),'1 Nov 2026');
  assert.equal(dateLabel(null),'—');
});

test('limited-role overview hides unauthorized financial values even if stale data is supplied', () => {
  const {ShopOverview}=loadWebModule('features/shop/shop-overview.tsx');
  const html=renderToStaticMarkup(React.createElement(ShopOverview,{capabilities:{crm:false,sales:false,inventory:true,finance:false},overview:{customers:999,leads:900,dueFollowUps:88,products:1,lowStock:0,inventoryValue:'100.00',outstanding:'99999.00',activity:[{id:'secret',type:'finance.payment',actor:'Hidden finance actor',at:'2026-10-01T00:00:00Z'}]},report:{currency:'INR',precision:2,recognizedRevenue:'88888.00',netProfit:'77777.00',dailyRevenue:[]},currency:'INR',precision:2,pending:false,onNavigate(){},onSale(){},onFollowUp(){}}));
  assert.match(html,/Inventory overview/);assert.doesNotMatch(html,/Recognized revenue|88,888|77,777|Hidden finance actor|CRM performance|Financial overview|88 customer follow-ups/);
});
