import { apiRequest } from '@/lib/api-client';
import type { AiProviderStatus } from '@/types/ai-v1';

export const aiV1Api = {
  getProviders: () => apiRequest<AiProviderStatus[]>('/v1/ai/providers'),
};
