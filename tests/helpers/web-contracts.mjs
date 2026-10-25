import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const root = fileURLToPath(new URL('../../', import.meta.url));
const webRoot = path.join(root, 'apps/web');
export function loadWebModule(relative, overrides = {}, cache = new Map()) {
  const filename = path.resolve(webRoot, relative);
  if (!filename.startsWith(webRoot + path.sep)) throw new Error('Test module must belong to apps/web');
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, { fileName: filename, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const module = { exports: {} }; cache.set(filename, module);
  const nativeRequire = createRequire(filename);
  const require = name => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name.startsWith('@/') || name.startsWith('.')) {
      const candidate = name.startsWith('@/') ? path.join(webRoot, name.slice(2)) : path.resolve(path.dirname(filename), name);
      const resolved = [candidate, candidate + '.ts', candidate + '.tsx', path.join(candidate, 'index.ts')].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
      if (!resolved) throw new Error(`Cannot resolve ${name}`);
      if (resolved.endsWith('.css')) return {};
      return loadWebModule(path.relative(webRoot, resolved), overrides, cache);
    }
    return nativeRequire(name);
  };
  new Function('require', 'module', 'exports', compiled)(require, module, module.exports);
  return module.exports;
}

// Historical phase release numbers conflict with each other and do not define
// today's retail version. The supported contract is valid, synchronized manifests.
export function assertReleaseVersions(packages = ['package.json', 'apps/api/package.json', 'apps/web/package.json'].map(file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))), lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'))) {
  const version = packages[0].version;
  assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);
  assert.equal(packages[1].version, version, 'API and root releases must agree');
  assert.equal(packages[2].version, version, 'web and root releases must agree');
  assert.equal(lock.packages[''].version, version, 'lockfile and root release must agree');
}

export function assertRegisteredWorkspaceModule(key, route, label) {
  const { registeredWorkspaceModules } = loadWebModule('features/workspace/module-registry.ts');
  const entry = registeredWorkspaceModules.find(module => module.key === key);
  assert.ok(entry, `${key} must be registered`);
  assert.equal(entry.route, route); assert.equal(entry.label, label);
  assert.equal(entry.enabled, true); assert.ok(entry.icon);
  assert.ok(entry.permissions.includes('read'));
  assert.ok(entry.metadata.featureFlags.includes('permission-aware-rendering'));
  assert.equal(new Set(registeredWorkspaceModules.map(module => module.key)).size, registeredWorkspaceModules.length);
  assert.match(fs.readFileSync(path.join(webRoot, 'features/workspace/workspace-config.ts'), 'utf8'), /foundationModules\s*=\s*registeredWorkspaceModules/);
  assert.ok(fs.existsSync(path.join(webRoot, 'app', route, 'page.tsx')), `${route} must have a page`);
}
