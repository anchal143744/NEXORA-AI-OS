import { Injectable } from '@nestjs/common';

export interface PromptDefinition {
  key: string;
  version: number;
  systemPrompt: string;
  allowedTools: string[];
}

@Injectable()
export class PromptRegistry {
  private readonly prompts = new Map<string, PromptDefinition>();

  register(prompt: PromptDefinition) {
    this.prompts.set(`${prompt.key}:v${prompt.version}`, prompt);
  }

  get(key: string, version: number) {
    return this.prompts.get(`${key}:v${version}`);
  }
}
