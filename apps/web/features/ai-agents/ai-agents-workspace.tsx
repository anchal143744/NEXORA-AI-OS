'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AgentAnalytics } from './agent-analytics';
import { AgentBuilder } from './agent-builder';
import { AgentDeploymentCenter } from './agent-deployment-center';
import { AgentExecutionHistory } from './agent-execution-history';
import { AgentMonitoring } from './agent-monitoring';
import { AgentPermissions } from './agent-permissions';
import { AgentTemplatesMarketplace } from './agent-templates-marketplace';
import { AiAgentCopilot } from './ai-agent-copilot';
import { AiAgentsHome } from './ai-agents-home';
import { AiAgentsNavigation } from './ai-agents-navigation';
import { EnterpriseAutomationDashboard } from './enterprise-automation-dashboard';
import { MultiAgentCollaboration } from './multi-agent-collaboration';
import { WorkflowAutomationCenter } from './workflow-automation-center';

export function AiAgentsWorkspace() {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Sparkles className="size-3" />Phase 58 AI Agents Workspace</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Create, deploy and optimize AI agents without technical complexity.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">AI Agents, templates, deployments, monitoring, execution history, permissions, multi-agent collaboration, workflow automation, analytics, enterprise automation and Copilot guidance are unified into one flagship workspace.</p>
          </div>
          <Badge variant="success"><BadgeCheck className="size-3" />Agent-ready</Badge>
        </motion.div>
        <motion.div variants={staggerItem}><AiAgentsNavigation /></motion.div>
        <AiAgentsHome />
        <motion.div variants={staggerItem}><AiAgentCopilot /></motion.div>
        <motion.div variants={staggerItem}><AgentBuilder /></motion.div>
        <motion.div variants={staggerItem}><AgentTemplatesMarketplace /></motion.div>
        <motion.div variants={staggerItem}><AgentDeploymentCenter /></motion.div>
        <motion.div variants={staggerItem}><AgentMonitoring /></motion.div>
        <motion.div variants={staggerItem}><AgentExecutionHistory /></motion.div>
        <motion.div variants={staggerItem}><AgentPermissions /></motion.div>
        <motion.div variants={staggerItem}><MultiAgentCollaboration /></motion.div>
        <motion.div variants={staggerItem}><WorkflowAutomationCenter /></motion.div>
        <motion.div variants={staggerItem}><AgentAnalytics /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseAutomationDashboard /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
