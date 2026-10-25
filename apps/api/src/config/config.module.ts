import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';
import { resolve } from 'path';

import { appConfig } from './configuration';
import { validateEnvironment } from './env.validation';

const envFilePath = resolveEnvFilePaths();

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      expandVariables: true,
      ignoreEnvFile: process.env.NEXORA_IGNORE_ENV_FILE === 'true',
      load: [appConfig],
      validate: validateEnvironment,
    }),
  ],
})
export class ConfigModule {}

function resolveEnvFilePaths(): string[] {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const roots = unique([
    process.cwd(),
    resolve(process.cwd(), '../..'),
    resolve(__dirname, '../../../..'),
    resolve(__dirname, '../../..'),
  ]);

  const fileNames = [
    `.env.${nodeEnv}.local`,
    `.env.${nodeEnv}`,
    '.env.local',
    '.env',
  ];

  return unique(
    roots.flatMap((rootPath) => fileNames.map((fileName) => resolve(rootPath, fileName))),
  ).filter((candidate) => existsSync(candidate));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
