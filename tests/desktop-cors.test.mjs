import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {desktopCorsOrigins}=require('../apps/api/dist/common/middleware/desktop-cors.js');
test('desktop CORS allows the configured loopback frontend origins only',()=>{
  const origins=desktopCorsOrigins('3001');
  assert.deepEqual(origins,['http://localhost:3001','http://127.0.0.1:3001']);
  for(const value of ['null','https://external.invalid','http://localhost:3000','http://localhost:3001.external.invalid']) assert.ok(!origins.includes(value));
});
test('desktop CORS rejects malformed, missing-range and injected ports',()=>{
  for(const value of ['-1','0','65536','3001/path','3001@external.invalid'])assert.throws(()=>desktopCorsOrigins(value));
});
