import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export function runtimeManifest(root) {
  const entries=[];
  function walk(relative) {
    const absolute=path.join(root,relative),stat=fs.lstatSync(absolute);
    if(stat.isSymbolicLink()) return; // npm workspace links are covered by their real roots below.
    if(stat.isDirectory()) {
      for(const name of fs.readdirSync(absolute).sort()) {
        if(name==='cache'&&relative.replaceAll('\\','/').endsWith('/.next')) continue;
        if(name==='trace'&&relative.replaceAll('\\','/').endsWith('/.next')) continue;
        walk(path.join(relative,name));
      }
    } else if(stat.isFile()) {
      if(/[\r\n\t]/.test(relative)) throw new Error('Unsupported runtime file name');
      const digest=createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
      entries.push(digest+'\t'+relative.replaceAll('\\','/'));
    }
  }
  for(const name of ['package.json','package-lock.json','scripts','node_modules','apps/api/dist','apps/web/.next','apps/web/public','apps/web/package.json']) if(fs.existsSync(path.join(root,name))) walk(name);
  const packages=path.join(root,'packages');
  if(fs.existsSync(packages))for(const name of fs.readdirSync(packages))for(const part of ['dist','package.json'])if(fs.existsSync(path.join(packages,name,part)))walk(path.join('packages',name,part));
  return entries.join('\n')+'\n';
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const root=fileURLToPath(new URL('../../',import.meta.url));
  if(!process.argv[2]) throw new Error('Output path is required');
  fs.writeFileSync(process.argv[2],runtimeManifest(root));
  console.log('Embedded runtime integrity manifest created; no environment, data, backups or credentials included.');
}
