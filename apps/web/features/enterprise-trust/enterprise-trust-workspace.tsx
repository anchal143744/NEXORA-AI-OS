'use client';

import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AiSecurityGovernanceValidation } from './ai-security-governance-validation';
import { ComplianceEvidenceRepository } from './compliance-evidence-repository';
import { ComplianceManagement } from './compliance-management';
import { DataProtectionFramework } from './data-protection-framework';
import { EnterpriseTrustHome } from './enterprise-trust-home';
import { EnterpriseTrustNavigation } from './enterprise-trust-navigation';
import { IncidentResponseCenter } from './incident-response-center';
import { PrivacyManagement } from './privacy-management';
import { RiskManagement } from './risk-management';
import { SecurityAuditCenter } from './security-audit-center';
import { SecurityOperationsDashboard } from './security-operations-dashboard';
import { TrustCenter } from './trust-center';
import { VendorSecurityManagement } from './vendor-security-management';
import { VulnerabilityManagement } from './vulnerability-management';

export function EnterpriseTrustWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><ShieldCheck className="size-3" />Phase 63 Enterprise Trust</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Security audit, compliance certification and trust program for enterprise buyers.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Security audits, vulnerabilities, compliance controls, privacy, data protection, risks, incidents, evidence, vendors and AI governance validation are unified into one executive trust workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><LockKeyhole className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><ShieldCheck className="size-3" />2.3.0-RC1 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><EnterpriseTrustNavigation /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseTrustHome /></motion.div>
        <motion.div variants={staggerItem}><SecurityAuditCenter /></motion.div>
        <motion.div variants={staggerItem}><VulnerabilityManagement /></motion.div>
        <motion.div variants={staggerItem}><SecurityOperationsDashboard /></motion.div>
        <motion.div variants={staggerItem}><ComplianceManagement /></motion.div>
        <motion.div variants={staggerItem}><TrustCenter /></motion.div>
        <motion.div variants={staggerItem}><PrivacyManagement /></motion.div>
        <motion.div variants={staggerItem}><DataProtectionFramework /></motion.div>
        <motion.div variants={staggerItem}><RiskManagement /></motion.div>
        <motion.div variants={staggerItem}><IncidentResponseCenter /></motion.div>
        <motion.div variants={staggerItem}><ComplianceEvidenceRepository /></motion.div>
        <motion.div variants={staggerItem}><VendorSecurityManagement /></motion.div>
        <motion.div variants={staggerItem}><AiSecurityGovernanceValidation /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
