export interface AiProviderContract {
  provider: 'openai' | string;
  model: string;
  capabilities: Array<'chat' | 'tools' | 'vision' | 'realtime' | 'embeddings'>;
}
