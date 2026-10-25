import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {loadLocalDevelopmentEnv} from './local-development-env.mjs';
import {desktopAddresses} from './desktop-config.mjs';

try {
  const {front}=desktopAddresses(loadLocalDevelopmentEnv());
  const candidates=[process.env['ProgramFiles(x86)'],process.env.ProgramFiles]
    .filter(Boolean).map(base=>path.join(base,'Microsoft','Edge','Application','msedge.exe'));
  const browser=candidates.find(file=>fs.existsSync(file));
  if(!browser) throw new Error('Microsoft Edge is unavailable.');
  const health=await fetch(front+'/api/v1/health/live',{signal:AbortSignal.timeout(5000)});
  await health.body?.cancel();
  if(health.status!==200) throw new Error('NEXORA is not healthy yet.');
  // Keep the existing Default profile and its saved login; avoid reliance on a stale PWA app ID.
  const child=spawn(browser,['--profile-directory=Default','--app='+front+'/dashboard'],
    {detached:true,stdio:'ignore'});
  await once(child,'spawn');
  child.unref();
} catch {
  console.error('NEXORA app window could not open. Check Microsoft Edge and local app health. No saved data was changed.');
  process.exitCode=1;
}
