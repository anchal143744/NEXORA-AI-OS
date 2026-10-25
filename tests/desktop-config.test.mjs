import assert from 'node:assert/strict';import test from 'node:test';import {desktopAddresses} from '../scripts/desktop-config.mjs';
const base={PORT:'4001',NEXORA_WEB_PORT:'3001',NEXORA_API_INTERNAL_URL:'http://127.0.0.1:4001'};
test('desktop configuration preserves the exact local API and front-end port mapping',()=>assert.deepEqual(desktopAddresses(base),{front:'http://localhost:3001',api:'http://127.0.0.1:4001'}));
test('desktop configuration rejects remote URLs, credentials, unexpected paths, wrong protocols and conflicting ports without echoing values',()=>{
  for(const url of ['ftp://127.0.0.1:4001','http://remote.invalid:4001','http://private-user:secret-value@127.0.0.1:4001','http://localhost:4001/extra','http://localhost:4001/?key=secret-value','http://localhost:4001/#secret-value','http://localhost:9999','broken'])assert.throws(()=>desktopAddresses({...base,NEXORA_API_INTERNAL_URL:url}),error=>!error.message.includes('secret-value')&&!error.message.includes(url));
  for(const ports of [{NEXORA_WEB_PORT:'4001'},{PORT:'0'},{NEXORA_WEB_PORT:'-1'}])assert.throws(()=>desktopAddresses({...base,...ports}),/ports/);
});
