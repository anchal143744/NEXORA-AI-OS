import assert from 'node:assert/strict';import test from 'node:test';import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';
const require=createRequire(import.meta.url);
test('Next resolves the patched PostCSS 8 implementation and still transforms application CSS',async()=>{
  const nextRequire=createRequire(require.resolve('next/package.json'));
  assert.equal(nextRequire('postcss/package.json').version,'8.5.31');
  const postcss=nextRequire('postcss');const result=await postcss([root=>root.walkDecls('color',decl=>{decl.value='var(--shop-text)';})]).process('.shop-card { color: white; }',{from:undefined});
  assert.equal(result.css,'.shop-card { color: var(--shop-text); }');
});
test('Swagger uses patched YAML 5 while the CLI YAML 4 consumer remains on its compatible major',()=>{
  const swaggerRequire=createRequire(require.resolve('@nestjs/swagger/package.json'));
  assert.equal(swaggerRequire('js-yaml/package.json').version,'5.4.1');
  assert.equal(require('js-yaml/package.json').version,'4.3.2');
  const sample={openapi:'3.0.0',info:{title:'Synthetic NEXORA',version:'1'},paths:{}};
  for(const yaml of [swaggerRequire('js-yaml'),require('js-yaml')])assert.deepEqual(yaml.load(yaml.dump(sample)),sample);
});
test('security repair retains the API/web framework majors and uses the reviewed Tailwind 4 compiler',()=>{
  assert.match(require('next/package.json').version,/^15\./);
  assert.match(require('prisma/package.json').version,/^6\./);
  assert.equal(require('tailwindcss/package.json').version,'4.3.3');
  const pluginPackage=JSON.parse(fs.readFileSync(path.resolve(path.dirname(require.resolve('@tailwindcss/postcss')),'../package.json'),'utf8'));
  assert.equal(pluginPackage.version,'4.3.3');
  assert.match(require('@nestjs/swagger/package.json').version,/^11\./);
});
