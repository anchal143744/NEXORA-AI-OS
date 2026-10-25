import { Injectable } from '@nestjs/common';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { AiService } from '../ai.service';
import { LlmCompletionRequest, LlmCompletionResponse } from '../contracts/llm-provider.contract';

@Injectable()
export class AiProviderRouterService {
  constructor(private readonly openAi: AiService) {}

  supportedProviders() {
    return [
      { key: 'openai', name: 'OpenAI', configured: Boolean(process.env.OPENAI_API_KEY) },
      { key: 'claude', name: 'Claude', configured: Boolean(process.env.ANTHROPIC_API_KEY) },
      { key: 'gemini', name: 'Gemini', configured: Boolean(process.env.GEMINI_API_KEY) },
      { key: 'azure_openai', name: 'Azure OpenAI', configured: Boolean(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) },
      { key: 'local', name: 'Local Models', configured: Boolean(process.env.LOCAL_LLM_ENDPOINT) },
    ];
  }

  async complete(provider: string | undefined, request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    const key = provider ?? 'openai';
    const span = tracingBackend.startSpan('ai.completion', { kind: 'client', attributes: { provider: key, model: request.model, tenantId: request.tenantId, workspaceId: request.metadata?.workspaceId } });
    const started = process.hrtime.bigint();
    try {
      const response = await this.dispatch(key, request);
      this.record(key, response.model, started, 'ok', response.usage);
      tracingBackend.finishSpan(span, 'OK', { model: response.model, inputTokens: response.usage?.inputTokens, outputTokens: response.usage?.outputTokens });
      return response;
    } catch (error) {
      this.record(key, request.model ?? key, started, 'error');
      tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' });
      throw error;
    }
  }

  private dispatch(key: string, request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    if (key === 'openai') return this.openAi.complete(request);
    if (key === 'claude') return this.completeClaude(request);
    if (key === 'gemini') return this.completeGemini(request);
    if (key === 'azure_openai') return this.completeAzureOpenAi(request);
    if (key === 'local') return this.completeLocal(request);
    return Promise.resolve(this.providerNotConfigured(key, request.model));
  }

  private async completeClaude(request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    if (!process.env.ANTHROPIC_API_KEY) return this.providerNotConfigured('claude', request.model);
    const response = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: request.model ?? process.env.CLAUDE_DEFAULT_MODEL ?? 'claude-3-5-sonnet-latest', max_tokens: 1200, messages: request.messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })), system: request.messages.find((m) => m.role === 'system')?.content }) });
    const data: any = await response.json();
    return { id: data.id ?? 'claude-response', model: data.model ?? request.model ?? 'claude', content: data.content?.map((part: any) => part.text).join('\n') ?? '', usage: { inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens } };
  }

  private async completeGemini(request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    if (!process.env.GEMINI_API_KEY) return this.providerNotConfigured('gemini', request.model);
    const model = request.model ?? process.env.GEMINI_DEFAULT_MODEL ?? 'gemini-1.5-pro';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: request.messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })), systemInstruction: { parts: [{ text: request.messages.find((m) => m.role === 'system')?.content ?? '' }] } }) });
    const data: any = await response.json();
    return { id: data.responseId ?? 'gemini-response', model, content: data.candidates?.[0]?.content?.parts?.map((part: any) => part.text).join('\n') ?? '', usage: { inputTokens: data.usageMetadata?.promptTokenCount, outputTokens: data.usageMetadata?.candidatesTokenCount } };
  }

  private async completeAzureOpenAi(request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT; const apiKey = process.env.AZURE_OPENAI_API_KEY; const deployment = request.model ?? process.env.AZURE_OPENAI_DEPLOYMENT;
    if (!endpoint || !apiKey || !deployment) return this.providerNotConfigured('azure_openai', request.model);
    const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION ?? '2024-02-15-preview'}`;
    const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'api-key': apiKey }, body: JSON.stringify({ messages: request.messages, temperature: request.temperature ?? 0.2 }) });
    const data: any = await response.json();
    return { id: data.id ?? 'azure-openai-response', model: deployment, content: data.choices?.[0]?.message?.content ?? '', usage: { inputTokens: data.usage?.prompt_tokens, outputTokens: data.usage?.completion_tokens } };
  }

  private async completeLocal(request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    const endpoint = process.env.LOCAL_LLM_ENDPOINT;
    if (!endpoint) return this.providerNotConfigured('local', request.model);
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: request.model, messages: request.messages, temperature: request.temperature ?? 0.2 }) });
    const data: any = await response.json();
    return { id: data.id ?? 'local-response', model: data.model ?? request.model ?? 'local', content: data.choices?.[0]?.message?.content ?? data.content ?? '', usage: data.usage };
  }

  private providerNotConfigured(provider: string, model?: string): LlmCompletionResponse { return { id: `${provider}-not-configured`, model: model ?? provider, content: 'AI provider is not configured. Configure provider credentials to enable live model responses.', usage: { inputTokens: 0, outputTokens: 0 } }; }

  private record(provider: string, model: string, started: bigint, status: string, usage?: { inputTokens?: number; outputTokens?: number }) {
    const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
    telemetryRegistry.incrementCounter('nexora_ai_executions_total', 1, { provider, model, status });
    telemetryRegistry.observeHistogram('nexora_ai_execution_duration_ms', durationMs, { provider, model, status });
    telemetryRegistry.incrementCounter('nexora_ai_tokens_total', usage?.inputTokens ?? 0, { provider, model, direction: 'input' });
    telemetryRegistry.incrementCounter('nexora_ai_tokens_total', usage?.outputTokens ?? 0, { provider, model, direction: 'output' });
  }
}