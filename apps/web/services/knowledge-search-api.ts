const jsonHeaders = { 'Content-Type': 'application/json' };

export type SearchPayload = {
  query: string;
  moduleKey?: string;
  sourceType?: string;
  searchType?: 'global' | 'module' | 'discovery' | 'semantic' | 'context' | 'retrieval';
  limit?: number;
  filters?: Record<string, unknown>;
  includeSensitive?: boolean;
};

export type RetrievalPayload = SearchPayload & {
  sessionKey?: string;
  retrievalType?: 'copilot' | 'agent' | 'semantic' | 'context' | 'knowledge_graph';
  maxResults?: number;
  includeMemory?: boolean;
  includeGraph?: boolean;
};

export const knowledgeSearchApi = {
  global: (query: string) => fetch(`/api/v1/search/global?query=${encodeURIComponent(query)}`),
  module: (query: string, moduleKey: string) => fetch(`/api/v1/search/module?query=${encodeURIComponent(query)}&moduleKey=${encodeURIComponent(moduleKey)}`),
  search: (payload: SearchPayload) => fetch('/api/v1/search', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  discovery: (query: string) => fetch(`/api/v1/search/discovery?query=${encodeURIComponent(query)}`),
  saved: () => fetch('/api/v1/search/saved'),
  save: (payload: unknown) => fetch('/api/v1/search/saved', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  runSaved: (id: string) => fetch(`/api/v1/search/saved/${id}/run`, { method: 'POST' }),
  semantic: (payload: SearchPayload) => fetch('/api/v1/search/semantic', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  context: (payload: SearchPayload) => fetch('/api/v1/search/context', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  retrieve: (payload: RetrievalPayload) => fetch('/api/v1/search/retrieval', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  copilotRetrieval: (payload: RetrievalPayload) => fetch('/api/v1/search/retrieval/copilot', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  agentRetrieval: (payload: RetrievalPayload) => fetch('/api/v1/search/retrieval/agents', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
  indexes: () => fetch('/api/v1/search/indexes'),
  createIndex: (payload: unknown) => fetch('/api/v1/search/indexes', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) }),
};