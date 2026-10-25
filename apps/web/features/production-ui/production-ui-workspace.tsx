'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AccessibilityEnhancement } from './accessibility-enhancement';
import { EmptyLoadingStates } from './empty-loading-states';
import { EnterpriseDemoMode } from './enterprise-demo-mode';
import { ErrorHandlingExperience } from './error-handling-experience';
import { GlobalUxAudit } from './global-ux-audit';
import { MobileExperienceOptimization } from './mobile-experience-optimization';
import { NavigationRefinement } from './navigation-refinement';
import { NotificationExperience } from './notification-experience';
import { PerformanceOptimization } from './performance-optimization';
import { ProductionUiHome } from './production-ui-home';
import { ProductionUiNavigation } from './production-ui-navigation';
import { ProductionUiReleaseCandidate } from './production-ui-release-candidate';
import { TabletExperienceOptimization } from './tablet-experience-optimization';
import { UiConsistencyEngine } from './ui-consistency-engine';

export function ProductionUiWorkspace() {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Sparkles className="size-3" />Phase 60 Production UI RC</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Launch-ready UX polish for a world-class enterprise SaaS experience.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">UX audit, consistency, mobile and tablet optimization, accessibility, performance, navigation, states, errors, notifications, demo mode and release-candidate checks are unified into one production readiness workspace.</p>
          </div>
          <Badge variant="success"><BadgeCheck className="size-3" />2.0.0-RC1 ready</Badge>
        </motion.div>
        <motion.div variants={staggerItem}><ProductionUiNavigation /></motion.div>
        <ProductionUiHome />
        <motion.div variants={staggerItem}><GlobalUxAudit /></motion.div>
        <motion.div variants={staggerItem}><UiConsistencyEngine /></motion.div>
        <motion.div variants={staggerItem} className="grid gap-4 xl:grid-cols-2">
          <MobileExperienceOptimization />
          <TabletExperienceOptimization />
        </motion.div>
        <motion.div variants={staggerItem}><AccessibilityEnhancement /></motion.div>
        <motion.div variants={staggerItem}><PerformanceOptimization /></motion.div>
        <motion.div variants={staggerItem}><NavigationRefinement /></motion.div>
        <motion.div variants={staggerItem}><EmptyLoadingStates /></motion.div>
        <motion.div variants={staggerItem}><ErrorHandlingExperience /></motion.div>
        <motion.div variants={staggerItem}><NotificationExperience /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseDemoMode /></motion.div>
        <motion.div variants={staggerItem}><ProductionUiReleaseCandidate /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
