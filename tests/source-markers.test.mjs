import test from 'node:test';import assert from 'node:assert/strict';import {hasDisallowedSourceMarkers} from '../scripts/source-markers.mjs';
test('lint permits real task status values and text while rejecting placeholder comments',()=>{
  assert.equal(hasDisallowedSourceMarkers("type Status='TODO'|'DONE'; const label='debugger'; const url='https://example.invalid/TODO';"),false);
  assert.equal(hasDisallowedSourceMarkers('// TODO: implement\nconst value=1;'),true);
  assert.equal(hasDisallowedSourceMarkers('/* FIXME: handle failure */\nconst value=1;'),true);
});
test('lint rejects debugger statements without rejecting property names',()=>{
  assert.equal(hasDisallowedSourceMarkers('function bad(){debugger;}'),true);
  assert.equal(hasDisallowedSourceMarkers('const good={debugger:true};'),false);
});
