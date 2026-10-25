import { Injectable } from '@nestjs/common';
import { LlmCompletionRequest, LlmCompletionResponse, LlmProvider } from '../contracts/llm-provider.contract';

@Injectable()
export class OpenAiProvider implements LlmProvider {
  readonly name = 'openai';

  async complete(request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    if (!process.env.OPENAI_API_KEY) {
      return {
        id: 'openai-not-configured',
        model: request.model ?? process.env.OPENAI_DEFAULT_MODEL ?? 'gpt-4.1-mini',
        content: 'OpenAI provider is not configured. Set OPENAI_API_KEY to enable live model responses.',
        usage: { inputTokens: 0, outputTokens: 0 },
      };
    }
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: request.model ?? process.env.OPENAI_DEFAULT_MODEL ?? 'gpt-4.1-mini',
      messages: request.messages as any,
      temperature: request.temperature ?? 0.2,
    });
    return {
      id: response.id,
      model: response.model,
      content: response.choices[0]?.message?.content ?? '',
      usage: { inputTokens: response.usage?.prompt_tokens, outputTokens: response.usage?.completion_tokens },
    };
  }
}