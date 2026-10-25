import {fileURLToPath} from 'node:url';
import {recoverUiSourceConfiguration} from '../tests/e2e/ui-source-configuration.mjs';
recoverUiSourceConfiguration(fileURLToPath(new URL('../',import.meta.url)));
console.log('Recovered only the stopped UI fixture\'s generated source changes; no database or application data was touched.');
