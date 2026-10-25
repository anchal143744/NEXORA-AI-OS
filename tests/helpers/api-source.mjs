import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import ts from 'typescript';
const root=path.resolve('apps/api/src');
export function loadApiSource(relative,overrides={},cache=new Map()){
  const filename=path.resolve(root,relative);if(!filename.startsWith(root+path.sep))throw new Error('API source must stay in the repository');if(cache.has(filename))return cache.get(filename).exports;
  const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:false,esModuleInterop:true}}).outputText;
  const module={exports:{}};cache.set(filename,module);const native=createRequire(filename);const require=name=>{if(Object.hasOwn(overrides,name))return overrides[name];if(name.startsWith('.')){const target=path.resolve(path.dirname(filename),name);const file=[target,target+'.ts',path.join(target,'index.ts')].find(file=>fs.existsSync(file)&&fs.statSync(file).isFile());if(!file)throw new Error('Missing API source dependency');return loadApiSource(path.relative(root,file),overrides,cache);}return native(name);};new Function('require','module','exports',code)(require,module,module.exports);return module.exports;
}
