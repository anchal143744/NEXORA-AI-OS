import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const prismaRequire=createRequire(require.resolve('prisma/package.json'));

test('Prisma 6 config loader accepts real config with the patched merger',async()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'nexora-prisma-config-'));
  // No connection is created and no environment credentials are read.
  fs.writeFileSync(path.join(directory,'prisma.config.js'),"module.exports={schema:'schema.prisma',migrations:{path:'migrations',seed:'node seed.js'}};");
  const config=prismaRequire('@prisma/config');
  const loaded=await config.loadConfigFromFile({configRoot:directory,configFile:'prisma.config.js'});
  assert.equal(loaded.error,undefined,JSON.stringify(loaded.error));
  assert.equal(loaded.config.schema,path.join(directory,'schema.prisma'));
  assert.equal(loaded.config.migrations.path,path.join(directory,'migrations'));
  assert.equal(loaded.config.migrations.seed,'node seed.js');
});

test('patched Prisma merger retains plain record, array, undefined and function config semantics and handles cycles',async()=>{
  const {deepmerge}=await import(pathToFileURL(prismaRequire.resolve('deepmerge-ts')).href);
  const adapter=()=>({provider:'synthetic'});
  const first={schema:'schema.prisma',migrations:{path:'a',seed:undefined},files:['one'],adapter};
  const second={migrations:{seed:'node seed.js'},files:['two']};
  assert.deepEqual(deepmerge(first,second),{schema:'schema.prisma',migrations:{path:'a',seed:'node seed.js'},files:['one','two'],adapter});
  assert.deepEqual(first.files,['one']);
  const a={name:'first'};a.self=a;const b={name:'second'};b.self=b;
  const result=deepmerge(a,b);assert.equal(result.name,'second');assert.equal(result.self,result);
});

test('reviewed Tailwind 4 pipeline compiles actual theme, responsive, group, peer and arbitrary variants',async()=>{
  const postcss=require('postcss'),tailwind=require('@tailwindcss/postcss');
  const web=path.resolve('apps/web');
  const source='@import "tailwindcss" source(none); @config "../tailwind.config.ts"; @source inline("group-hover:bg-red-500 peer-checked:block [&>span]:font-bold hover:text-white md:grid bg-graphite-950 rounded-sm");';
  const result=await postcss([tailwind({base:web,optimize:false})]).process(source,{from:path.join(web,'styles/compatibility-fixture.css')});
  fs.mkdirSync('tests/.runtime',{recursive:true});fs.writeFileSync('tests/.runtime/tailwind4-compatibility.css',result.css);
  for(const expected of ['group-hover','peer-checked',':checked','>span','--font-weight-bold','@media (width >= 48rem)'])assert.ok(result.css.includes(expected),expected);
  const declarations=(selector)=>{const values={};result.root.walkRules(selector,rule=>rule.walkDecls(decl=>{values[decl.prop]=decl.value;}));return values;};
  assert.equal(declarations('.bg-graphite-950')['background-color'].toLowerCase(),'#0b1220');
  assert.equal(declarations('.rounded-sm')['border-radius'],'6px');
  assert.doesNotMatch(result.css,/@source|@config|@tailwind/);
});
