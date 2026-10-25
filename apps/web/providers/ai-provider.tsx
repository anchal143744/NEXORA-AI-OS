'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSuggestedCopilotPrompts } from '@/features/ai/ai-command-registry';
import { createRecommendations } from '@/features/ai/ai-context-engine';
import { fetchExecutiveBriefing, sendCopilotPrompt } from '@/features/ai/ai-copilot-service';
import { useWorkspaceEngine } from '@/providers/workspace-provider';
import type { AiCopilotMessage, AiRecommendation, ExecutiveBriefing } from '@/types/ai-copilot';
import type { WorkspaceAiContext } from '@/types/workspace';

const conversationStorageKey = 'nexora.phase5.ai-copilot.history';

type AiContextValue = {
  copilotEnabled: boolean;
  agentModes: string[];
  activeWorkspaceContext?: WorkspaceAiContext;
  messages: AiCopilotMessage[];
  recommendations: AiRecommendation[];
  briefing?: ExecutiveBriefing;
  suggestedPrompts: string[];
  isThinking: boolean;
  briefingLoading: boolean;
  error?: string;
  askCopilot: (prompt: string) => Promise<void>;
  clearConversation: () => void;
  refreshExecutiveBriefing: () => Promise<void>;
};

const AiContext = createContext<AiContextValue>({
  copilotEnabled: true,
  agentModes: ['executive', 'operations', 'analytics'],
  messages: [],
  recommendations: [],
  suggestedPrompts: [],
  isThinking: false,
  briefingLoading: false,
  askCopilot: async () => undefined,
  clearConversation: () => undefined,
  refreshExecutiveBriefing: async () => undefined,
});

export function AiProvider({ children }: { children: ReactNode }) {
  const { aiContext } = useWorkspaceEngine();
  const [messages, setMessages] = useState<AiCopilotMessage[]>([]);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(() => createRecommendations(aiContext));
  const [briefing, setBriefing] = useState<ExecutiveBriefing>();
  const [isThinking, setIsThinking] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(conversationStorageKey);
      if (raw) setMessages(JSON.parse(raw) as AiCopilotMessage[]);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(conversationStorageKey, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  useEffect(() => {
    setRecommendations(createRecommendations(aiContext));
  }, [aiContext]);

  const refreshExecutiveBriefing = useCallback(async () => {
    setBriefingLoading(true);
    setError(undefined);
    try {
      const nextBriefing = await fetchExecutiveBriefing(aiContext);
      setBriefing(nextBriefing);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Unable to refresh executive briefing');
    } finally {
      setBriefingLoading(false);
    }
  }, [aiContext]);

  useEffect(() => {
    void refreshExecutiveBriefing();
  }, [refreshExecutiveBriefing]);

  const askCopilot = useCallback(async (prompt: string) => {
    const userMessage: AiCopilotMessage = {
      id: createMessageId('user'),
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    const history = [...messages, userMessage].slice(-20);
    setMessages((current) => [...current, userMessage]);
    setIsThinking(true);
    setError(undefined);

    try {
      const response = await sendCopilotPrompt({ prompt, context: aiContext, history });
      const assistantMessage: AiCopilotMessage = {
        id: createMessageId('assistant'),
        role: 'assistant',
        content: response.message,
        createdAt: new Date().toISOString(),
        source: response.source,
        actions: response.actions,
      };
      setMessages((current) => [...current, assistantMessage]);
      setRecommendations(response.recommendations);
      if (response.briefing) setBriefing(response.briefing);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'AI copilot request failed');
    } finally {
      setIsThinking(false);
    }
  }, [aiContext, messages]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') window.localStorage.removeItem(conversationStorageKey);
  }, []);

  const value = useMemo<AiContextValue>(() => ({
    copilotEnabled: true,
    agentModes: ['executive', 'operations', 'analytics', 'workflow'],
    activeWorkspaceContext: aiContext,
    messages,
    recommendations,
    briefing,
    suggestedPrompts: getSuggestedCopilotPrompts(aiContext),
    isThinking,
    briefingLoading,
    error,
    askCopilot,
    clearConversation,
    refreshExecutiveBriefing,
  }), [aiContext, messages, recommendations, briefing, isThinking, briefingLoading, error, askCopilot, clearConversation, refreshExecutiveBriefing]);

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
}

export function useAiContext() {
  return useContext(AiContext);
}

function createMessageId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return prefix + '-' + crypto.randomUUID();
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}
