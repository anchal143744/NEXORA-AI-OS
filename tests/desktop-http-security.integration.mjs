import test from 'node:test';import assert from 'node:assert/strict';
import {loadLocalDevelopmentEnv} from '../scripts/local-development-env.mjs';
import {desktopAddresses} from '../scripts/desktop-config.mjs';
const {front,api}=desktopAddresses(loadLocalDevelopmentEnv());
test('running desktop API authorizes only the configured loopback browser origin',async()=>{
  for(const [origin,expected]of [[front,front],['https://untrusted.invalid',null],['null',null]]){
    const response=await fetch(api+'/api/v1/health/live',{headers:{Origin:origin},signal:AbortSignal.timeout(5000)});
    await response.body?.cancel();assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),expected);
  }
});
test('production frontend serves a CSP without runtime eval and rejects unauthenticated business access',async()=>{
  const response=await fetch(front+'/login',{signal:AbortSignal.timeout(5000)});await response.body?.cancel();
  assert.equal(response.status,200);const csp=response.headers.get('content-security-policy');assert.ok(csp);assert.ok(!csp.includes("'unsafe-eval'"));assert.match(csp,/object-src 'none'/);
  const denied=await fetch(front+'/api/v1/retail/shop/settings',{signal:AbortSignal.timeout(5000)});await denied.body?.cancel();assert.equal(denied.status,401);
});
