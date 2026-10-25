'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { AuthLayout } from '@/features/auth/auth-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { discoverySteps, useDiscoveryStore } from '@/stores/discovery-store';
import { AiBusinessProfilingEngine } from './ai-business-profiling-engine';
import { AiReadinessScoring } from './ai-readiness-scoring';
import { BusinessDiscoveryWizard } from './business-discovery-wizard';
import { OneClickWorkspaceGeneration } from './one-click-workspace-generation';
import { WorkspaceBlueprintGenerator } from './workspace-blueprint-generator';
import { WorkspacePreview } from './workspace-preview';
import { WorkspaceRecommendationPanel } from './workspace-recommendation-panel';

export function WorkspaceIntelligenceWorkspace() {
  const currentStep = useDiscoveryStore((state) => state.currentStep);
  const setCurrentStep = useDiscoveryStore((state) => state.setCurrentStep);

  return (
    <AuthLayout mode="welcome">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem}>
          <Badge><Sparkles className="size-3" />Phase 53 Workspace Intelligence</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">Discover the business, then generate the workspace.</h2>
          <p className="mt-3 text-sm leading-7 text-graphite-300">A conversational AI-guided setup collects business context, detects industry, maps teams and software, recommends modules and generates a workspace blueprint.</p>
        </motion.div>
        <motion.div variants={staggerItem}>
          <nav aria-label="Discovery steps" className="grid gap-2 md:grid-cols-4">
            {discoverySteps.map((step) => (
              <button
                key={step.key}
                onClick={() => setCurrentStep(step.key)}
                className={'rounded-lg border p-3 text-left transition focus-visible:premium-focus ' + (currentStep === step.key ? 'border-gold-500/40 bg-gold-500/12' : 'border-white/10 bg-white/[0.045] hover:bg-white/[0.07]')}
              >
                <div className="text-xs font-semibold uppercase text-graphite-500">{step.label}</div>
                <div className="mt-1 text-xs leading-5 text-graphite-300">{step.prompt}</div>
              </button>
            ))}
          </nav>
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-4">
          <BusinessDiscoveryWizard />
          <AiBusinessProfilingEngine />
          <WorkspaceBlueprintGenerator />
          <WorkspaceRecommendationPanel />
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <WorkspacePreview />
            <AiReadinessScoring />
          </div>
          <OneClickWorkspaceGeneration />
          <Card>
            <CardContent className="flex items-start gap-3 p-4 text-sm text-graphite-300">
              <Brain className="mt-0.5 size-4 shrink-0 text-gold-300" />
              Phase 54 can now turn this generated blueprint into the Enterprise Command Center with workspace creation, command actions and operational launch controls.
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
