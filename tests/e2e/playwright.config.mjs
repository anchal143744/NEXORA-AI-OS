import {defineConfig} from '@playwright/test';
// Discovery/--list is allowed without a database. Execution validates the
// server-reported data_directory before starting a frontend or browser action.
export default defineConfig({testDir:'.',testMatch:'retail-ui.spec.mjs',workers:1,retries:0,timeout:120000,expect:{timeout:20000},reporter:'list',outputDir:'../.runtime/ui-results',use:{browserName:'chromium',headless:true,trace:'off',screenshot:'off',video:'off'}});
