import test from 'node:test';import assert from 'node:assert/strict';
import {configuredSecrets,hasConfiguredSecret} from '../scripts/desktop/check-release-secrets.mjs';
test('release scan detects synthetic ASCII, JSON-escaped and UTF16 secrets without treating ordinary settings as secrets',()=>{
  const values=configuredSecrets({JWT_SECRET:'synthetic-secret-123456',NAME:'ordinary application label',SMTP_PASS:'a"synthetic-secret-98765'});
  assert.equal(values.length,2);assert.equal(hasConfiguredSecret(Buffer.from('safe compiled app'),values),false);
  for(const encoding of ['utf8','utf16le'])assert.equal(hasConfiguredSecret(Buffer.from('synthetic-secret-123456',encoding),values),true);
  assert.equal(hasConfiguredSecret(Buffer.from(JSON.stringify('a"synthetic-secret-98765')),values),true);
});
