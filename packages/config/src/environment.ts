export interface EnvironmentConfig {
  nodeEnv: 'development' | 'test' | 'staging' | 'production';
  port: number;
  databaseUrl: string;
  redisUrl: string;
  openaiApiKey?: string;
}
