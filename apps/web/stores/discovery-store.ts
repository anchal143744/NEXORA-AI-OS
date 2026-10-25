'use client';

import { create } from 'zustand';
import type { AiBusinessProfile, AiReadinessScore, DiscoveryAnswerMap, DiscoveryStepKey, WorkspaceBlueprint, WorkspaceGenerationResult } from '@/types/discovery';

export const discoverySteps: { key: DiscoveryStepKey; label: string; prompt: string }[] = [
  { key: 'business', label: 'Business', prompt: 'What does the company sell and how does it make money?' },
  { key: 'industry', label: 'Industry', prompt: 'Which market signals should NEXORA pay attention to?' },
  { key: 'team', label: 'Team', prompt: 'How is the organization structured today?' },
  { key: 'software', label: 'Software', prompt: 'Which tools and manual systems already run the company?' },
  { key: 'goals', label: 'Goals', prompt: 'What should the AI operating system optimize first?' },
  { key: 'intelligence', label: 'AI Profile', prompt: 'Let NEXORA infer business context and readiness.' },
  { key: 'preview', label: 'Preview', prompt: 'Review the generated workspace blueprint.' },
  { key: 'generate', label: 'Generate', prompt: 'Create the first intelligent workspace.' },
];

export const defaultDiscoveryAnswers: DiscoveryAnswerMap = {
  businessModel: 'Subscription platform with enterprise services',
  primaryOffer: 'AI business operating system for revenue, operations and automation',
  industryHint: 'SaaS',
  teamSize: '51-200',
  departments: ['Sales', 'Operations', 'Finance', 'Customer Success'],
  currentSoftware: ['HubSpot', 'QuickBooks', 'Slack', 'Google Workspace', 'Spreadsheet tracking'],
  operationalPain: ['Manual follow-up', 'Slow approvals', 'Disconnected reporting'],
  strategicGoals: ['Revenue growth', 'Operational automation', 'Customer retention'],
  automationComfort: 'medium',
  dataMaturity: 'developing',
};

type DiscoveryState = {
  currentStep: DiscoveryStepKey;
  completedSteps: DiscoveryStepKey[];
  answers: DiscoveryAnswerMap;
  profile: AiBusinessProfile | null;
  blueprint: WorkspaceBlueprint | null;
  readinessScore: AiReadinessScore | null;
  generationResult: WorkspaceGenerationResult | null;
  setCurrentStep: (step: DiscoveryStepKey) => void;
  updateAnswers: (answers: Partial<DiscoveryAnswerMap>) => void;
  completeStep: (step: DiscoveryStepKey) => void;
  setProfile: (profile: AiBusinessProfile | null) => void;
  setBlueprint: (blueprint: WorkspaceBlueprint | null) => void;
  setReadinessScore: (score: AiReadinessScore | null) => void;
  setGenerationResult: (result: WorkspaceGenerationResult | null) => void;
};

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  currentStep: 'business',
  completedSteps: [],
  answers: defaultDiscoveryAnswers,
  profile: null,
  blueprint: null,
  readinessScore: null,
  generationResult: null,
  setCurrentStep: (currentStep) => set({ currentStep }),
  updateAnswers: (answers) => set((state) => ({ answers: { ...state.answers, ...answers } })),
  completeStep: (step) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(step) ? state.completedSteps : [...state.completedSteps, step],
    })),
  setProfile: (profile) => set({ profile }),
  setBlueprint: (blueprint) => set({ blueprint }),
  setReadinessScore: (readinessScore) => set({ readinessScore }),
  setGenerationResult: (generationResult) => set({ generationResult }),
}));
