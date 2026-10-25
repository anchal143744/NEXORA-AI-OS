'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AiAnalyticsCopilot } from './ai-analytics-copilot';
import { AnalyticsHome } from './analytics-home';
import { AnalyticsNavigation } from './analytics-navigation';
import { BusinessIntelligenceDashboards } from './business-intelligence-dashboards';
import { CrossModuleAnalytics } from './cross-module-analytics';
import { DataVisualizationStudio } from './data-visualization-studio';
import { ExecutiveIntelligenceCenter } from './executive-intelligence-center';
import { ExecutiveScorecards } from './executive-scorecards';
import { ForecastingCenter } from './forecasting-center';
import { KpiManagement } from './kpi-management';
import { ReportBuilder } from './report-builder';
import { StrategicDecisionCenter } from './strategic-decision-center';
import { StrategicInsightsEngine } from './strategic-insights-engine';

export function AnalyticsWorkspace() {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Sparkles className="size-3" />Phase 59 Analytics Workspace</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Executive intelligence that turns business performance into action.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Analytics, BI dashboards, KPIs, cross-module intelligence, forecasts, strategic insights, reports, visualizations, scorecards, Copilot guidance and decision support are unified into one executive-grade workspace.</p>
          </div>
          <Badge variant="success"><BadgeCheck className="size-3" />Insight-ready</Badge>
        </motion.div>
        <motion.div variants={staggerItem}><AnalyticsNavigation /></motion.div>
        <AnalyticsHome />
        <motion.div variants={staggerItem}><AiAnalyticsCopilot /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveIntelligenceCenter /></motion.div>
        <motion.div variants={staggerItem}><BusinessIntelligenceDashboards /></motion.div>
        <motion.div variants={staggerItem}><KpiManagement /></motion.div>
        <motion.div variants={staggerItem}><CrossModuleAnalytics /></motion.div>
        <motion.div variants={staggerItem}><ForecastingCenter /></motion.div>
        <motion.div variants={staggerItem}><StrategicInsightsEngine /></motion.div>
        <motion.div variants={staggerItem}><ReportBuilder /></motion.div>
        <motion.div variants={staggerItem}><DataVisualizationStudio /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveScorecards /></motion.div>
        <motion.div variants={staggerItem}><StrategicDecisionCenter /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
