import assert from 'node:assert/strict';import test from 'node:test';
import {summarizeAudit} from '../scripts/security-audit-result.mjs';
const counts={info:0,low:0,moderate:0,high:0,critical:0,total:0};
test('audit cannot pass when npm fails to launch or returns empty/error JSON',()=>{
  for(const result of [{status:null,error:{code:'EINVAL'},stdout:''},{status:1,stdout:'{}'},{status:1,stdout:JSON.stringify({error:{code:'ENOTFOUND'}})},{status:0,stdout:'not json'},{status:1,stdout:JSON.stringify({metadata:{vulnerabilities:counts}})}]){const summary=summarizeAudit(result);assert.equal(summary.executed,false);assert.equal(summary.status,'unavailable');assert.equal(summary.vulnerabilities,null);}
});
test('audit preserves actual severity counts and blocks high or critical findings',()=>{
  const vulnerabilities={...counts,high:2,moderate:1,total:3};const summary=summarizeAudit({status:1,stdout:JSON.stringify({metadata:{vulnerabilities}})});assert.equal(summary.executed,true);assert.equal(summary.status,'review_required');assert.deepEqual(summary.vulnerabilities,vulnerabilities);
});
test('audit passes only a completed audit with no high/critical findings',()=>{
  const summary=summarizeAudit({status:0,stdout:JSON.stringify({metadata:{vulnerabilities:counts}})});assert.equal(summary.executed,true);assert.equal(summary.status,'passed');assert.deepEqual(summary.vulnerabilities,counts);
});
