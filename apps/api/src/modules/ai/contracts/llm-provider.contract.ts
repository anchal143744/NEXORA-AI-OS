export interface LlmMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface LlmCompletionRequest {
  tenantId: string;
  model?: string;
  messages: LlmMessage[];
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export interface LlmCompletionResponse {
  id: string;
  model: string;
  content: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface LlmProvider {
  readonly name: string;
  complete(request: LlmCompletionRequest): Promise<LlmCompletionResponse>;
}
