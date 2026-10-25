'use client';

import { create } from 'zustand';
import type { AiSetupProfile, BusinessProfile, OnboardingStepKey, WorkspaceGenerationResult } from '@/types/onboarding';

type OnboardingState = {
  currentStep: OnboardingStepKey;
  completedSteps: OnboardingStepKey[];
  businessProfile: Partial<BusinessProfile>;
  aiProfile: AiSetupProfile;
  workspaceResult: WorkspaceGenerationResult | null;
  setCurrentStep: (step: OnboardingStepKey) => void;
  completeStep: (step: OnboardingStepKey) => void;
  setBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  setAiProfile: (profile: AiSetupProfile) => void;
  setWorkspaceResult: (result: WorkspaceGenerationResult | null) => void;
};

export const onboardingSteps: { key: OnboardingStepKey; label: string; description: string }[] = [
  { key: 'welcome', label: 'Welcome', description: 'Set the operating context' },
  { key: 'auth', label: 'Authentication', description: 'Secure the first operator' },
  { key: 'organization', label: 'Organization', description: 'Create the enterprise tenant' },
  { key: 'business', label: 'Business', description: 'Classify the business profile' },
  { key: 'ai', label: 'AI setup', description: 'Tune copilot behavior' },
  { key: 'workspace', label: 'Workspace', description: 'Generate adaptive workspace' },
  { key: 'invite', label: 'Invites', description: 'Bring the team in' },
  { key: 'roles', label: 'Roles', description: 'Assign initial access' },
  { key: 'finish', label: 'Launch', description: 'Open the first workspace' },
];

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 'welcome',
  completedSteps: [],
  businessProfile: {
    businessType: 'Enterprise',
    industry: 'SaaS',
    country: 'United States',
    revenueRange: '1M-10M',
    teamSize: '51-200',
    goals: ['Revenue growth', 'Operational automation'],
  },
  aiProfile: {
    copilotTone: 'executive',
    enabledAgents: ['Executive Agent', 'Sales Agent', 'Operations Agent'],
    automationLevel: 'approval_required',
  },
  workspaceResult: null,
  setCurrentStep: (currentStep) => set({ currentStep }),
  completeStep: (step) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(step) ? state.completedSteps : [...state.completedSteps, step],
    })),
  setBusinessProfile: (profile) => set((state) => ({ businessProfile: { ...state.businessProfile, ...profile } })),
  setAiProfile: (aiProfile) => set({ aiProfile }),
  setWorkspaceResult: (workspaceResult) => set({ workspaceResult }),
}));
