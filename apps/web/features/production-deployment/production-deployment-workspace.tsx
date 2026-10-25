'use client';

import { motion } from 'framer-motion';
import { CloudCog, Rocket, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { BackupDisasterRecovery } from './backup-disaster-recovery';
import { CentralizedLogging } from './centralized-logging';
import { CidcPlatform } from './cicd-platform';
import { ContainerizationCenter } from './containerization-center';
import { EnterpriseTrialEnvironment } from './enterprise-trial-environment';
import { KubernetesDeployment } from './kubernetes-deployment';
import { LaunchReadinessCenter } from './launch-readiness-center';
import { MonitoringObservability } from './monitoring-observability';
import { MultiEnvironmentManagement } from './multi-environment-management';
import { ProductionDeploymentNavigation } from './production-deployment-navigation';
import { ProductionInfrastructure } from './production-infrastructure';
import { ProductionReadinessDashboard } from './production-readiness-dashboard';
import { SecurityHardening } from './security-hardening';

export function ProductionDeploymentWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><CloudCog className="size-3" />Phase 61 Production Deployment</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Production deployment, monitoring and public launch readiness for NEXORA AI OS.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Infrastructure, environments, CI/CD, containers, Kubernetes, monitoring, logging, security, backup, trial onboarding and launch gates are unified into an enterprise operations workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><ShieldCheck className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Rocket className="size-3" />2.1.0-RC1 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><ProductionDeploymentNavigation /></motion.div>
        <motion.div variants={staggerItem}><ProductionReadinessDashboard /></motion.div>
        <motion.div variants={staggerItem}><ProductionInfrastructure /></motion.div>
        <motion.div variants={staggerItem}><MultiEnvironmentManagement /></motion.div>
        <motion.div variants={staggerItem} className="grid gap-4 xl:grid-cols-2">
          <CidcPlatform />
          <ContainerizationCenter />
        </motion.div>
        <motion.div variants={staggerItem}><KubernetesDeployment /></motion.div>
        <motion.div variants={staggerItem} className="grid gap-4 xl:grid-cols-2">
          <MonitoringObservability />
          <CentralizedLogging />
        </motion.div>
        <motion.div variants={staggerItem}><SecurityHardening /></motion.div>
        <motion.div variants={staggerItem}><BackupDisasterRecovery /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseTrialEnvironment /></motion.div>
        <motion.div variants={staggerItem}><LaunchReadinessCenter /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
