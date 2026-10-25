import { Injectable } from '@nestjs/common';
import { LlmCompletionRequest } from './contracts/llm-provider.contract';
import { OpenAiProvider } from './providers/openai.provider';

@Injectable()
export class AiService {
  constructor(private readonly provider: OpenAiProvider) {}

  complete(request: LlmCompletionRequest) {
    return this.provider.complete(request);
  }
}
