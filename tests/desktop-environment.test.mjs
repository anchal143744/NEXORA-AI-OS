import test from 'node:test';import assert from 'node:assert/strict';
import {desktopRuntimeEnvironment} from '../scripts/desktop-config.mjs';
test('desktop runtime removes debugger and preloaded-code flags without mutating local configuration',()=>{
  const input={NODE_OPTIONS:'--inspect=0.0.0.0:9229 --require unsafe.cjs',NODE_INSPECT_RESUME_ON_START:'1',JWT_SECRET:'synthetic-value',PORT:'4001'};
  const result=desktopRuntimeEnvironment(input);assert.equal(result.NODE_OPTIONS,undefined);assert.equal(result.NODE_INSPECT_RESUME_ON_START,undefined);assert.equal(result.JWT_SECRET,input.JWT_SECRET);assert.equal(result.PORT,input.PORT);assert.ok(input.NODE_OPTIONS);
});
test('desktop refuses a TLS validation bypass rather than silently accepting it',()=>{
  assert.throws(()=>desktopRuntimeEnvironment({NODE_TLS_REJECT_UNAUTHORIZED:'0'}),/refuses disabled TLS/);
  assert.equal(desktopRuntimeEnvironment({NODE_TLS_REJECT_UNAUTHORIZED:'1'}).NODE_TLS_REJECT_UNAUTHORIZED,'1');
});
