'use client';

import { motion } from 'framer-motion';
import { Store, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AiAgentMarketplace } from './ai-agent-marketplace';
import { AiEcosystemCopilot } from './ai-ecosystem-copilot';
import { ApplicationMarketplace } from './application-marketplace';
import { CertificationProgram } from './certification-program';
import { DeveloperConsole } from './developer-console';
import { DeveloperPlatform } from './developer-platform';
import { EcosystemIntelligenceCenter } from './ecosystem-intelligence-center';
import { EcosystemMarketplaceHome } from './ecosystem-marketplace-home';
import { EcosystemMarketplaceNavigation } from './ecosystem-marketplace-navigation';
import { EnterpriseMarketplace } from './enterprise-marketplace';
import { ExtensionFramework } from './extension-framework';
import { IntegrationMarketplace } from './integration-marketplace';
import { MarketplaceAnalytics } from './marketplace-analytics';
import { MarketplaceBilling } from './marketplace-billing';
import { PartnerPortal } from './partner-portal';

export function EcosystemMarketplaceWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Store className="size-3" />Phase 64 Ecosystem Marketplace</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Enterprise marketplace, partner ecosystem and developer platform expansion.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Marketplace discovery, app and AI agent publishing, integrations, partner programs, developer console, extension framework, billing, analytics, certification and AI ecosystem intelligence are unified into one premium ecosystem workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Zap className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Store className="size-3" />2.4.0-RC1 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><EcosystemMarketplaceNavigation /></motion.div>
        <motion.div variants={staggerItem}><EcosystemMarketplaceHome /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseMarketplace /></motion.div>
        <motion.div variants={staggerItem}><AiAgentMarketplace /></motion.div>
        <motion.div variants={staggerItem}><ApplicationMarketplace /></motion.div>
        <motion.div variants={staggerItem}><IntegrationMarketplace /></motion.div>
        <motion.div variants={staggerItem}><PartnerPortal /></motion.div>
        <motion.div variants={staggerItem}><DeveloperPlatform /></motion.div>
        <motion.div variants={staggerItem}><DeveloperConsole /></motion.div>
        <motion.div variants={staggerItem}><ExtensionFramework /></motion.div>
        <motion.div variants={staggerItem}><MarketplaceBilling /></motion.div>
        <motion.div variants={staggerItem}><MarketplaceAnalytics /></motion.div>
        <motion.div variants={staggerItem}><CertificationProgram /></motion.div>
        <motion.div variants={staggerItem}><EcosystemIntelligenceCenter /></motion.div>
        <motion.div variants={staggerItem}><AiEcosystemCopilot /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
