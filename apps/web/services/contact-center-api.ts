const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`Contact center API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const contactCenterApi = {
  voiceSessions: () => request('/v1/voice-ai/sessions'),
  contactQueues: () => request('/v1/contact-center/queues'),
  unifiedInbox: () => request('/v1/contact-center/unified-inbox'),
  communicationChannels: () => request('/v1/communication-channels'),
  customerIdentities: () => request('/v1/customer-identity'),
  voiceAgents: () => request('/v1/voice-agents'),
  conversationInsights: (conversationId: string) => request(`/v1/conversation-intelligence/conversations/${conversationId}/insights`),
};
