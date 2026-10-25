import type {
  AiSecurityCheck,
  ComplianceControl,
  DataProtectionControl,
  EnterpriseRisk,
  EnterpriseTrustRoute,
  EvidenceItem,
  IncidentPlan,
  PrivacyControl,
  SecurityEvent,
  SecurityFinding,
  TrustCenterDocument,
  TrustMetric,
  VendorSecurityReview,
  VulnerabilitySignal,
} from '@/types/enterprise-trust';

export const trustMetrics: TrustMetric[] = [
  { id: 'security-score', label: 'Security Score', value: '87%', detail: 'Executive posture score across audit, vulnerability, privacy, data protection and incident readiness.' },
  { id: 'critical-issues', label: 'Critical Issues', value: '0', detail: 'No critical dependency or platform advisories detected in the current audit snapshot.' },
  { id: 'high-issues', label: 'High Issues', value: '9', detail: 'Tracked dependency advisories require semver-major remediation decisions.' },
  { id: 'compliance-readiness', label: 'Compliance Readiness', value: '82%', detail: 'SOC 2, ISO 27001, GDPR, HIPAA and PCI DSS readiness controls are mapped.' },
  { id: 'evidence-items', label: 'Evidence Items', value: '64', detail: 'Security reviews, validation reports, policies and control evidence are organized for audits.' },
];

export const securityFindings: SecurityFinding[] = [
  { id: 'dep-high', title: 'Dependency advisories requiring major-version decision', severity: 'high', owner: 'Platform Security', status: 'watch', remediation: 'Schedule semver-major remediation review for Nest and Next dependency advisories.' },
  { id: 'secret-rotation', title: 'Production secret rotation validation', severity: 'medium', owner: 'Cloud Operations', status: 'ready', remediation: 'Validate rotation evidence during production release rehearsal.' },
  { id: 'rbac-review', title: 'Quarterly RBAC access review', severity: 'medium', owner: 'IAM', status: 'ready', remediation: 'Complete owner, admin, manager and API key access review cadence.' },
  { id: 'ai-permission', title: 'AI agent permission boundary validation', severity: 'high', owner: 'AI Governance', status: 'ready', remediation: 'Verify agent actions require role and approval policy checks.' },
];

export const vulnerabilitySignals: VulnerabilitySignal[] = [
  { id: 'owasp', source: 'OWASP Top 10', category: 'Application Risks', score: 84, workflow: 'Security review and remediation tracking', validation: 'RBAC, validation, rate limit and audit controls checked.' },
  { id: 'dependencies', source: 'npm audit', category: 'Dependency Risks', score: 72, workflow: 'Dependency risk board', validation: '12 advisories tracked; 0 critical; semver-major decisions required.' },
  { id: 'infrastructure', source: 'Kubernetes and Docker', category: 'Infrastructure Risks', score: 86, workflow: 'Infrastructure release validation', validation: 'Probes, HPA, secrets examples and NGINX headers present.' },
  { id: 'application', source: 'Application Security', category: 'Application Risks', score: 88, workflow: 'Secure SDLC review', validation: 'Request validation, throttling, audit logging and workspace isolation tracked.' },
];

export const securityEvents: SecurityEvent[] = [
  { id: 'auth', event: 'Authentication anomaly review', riskScore: 22, trend: 'stable', status: 'ready' },
  { id: 'rate-limit', event: 'Rate limit pressure', riskScore: 18, trend: 'down', status: 'ready' },
  { id: 'dependency', event: 'Dependency advisory trend', riskScore: 46, trend: 'watch', status: 'watch' },
  { id: 'ai-actions', event: 'AI agent action review', riskScore: 28, trend: 'stable', status: 'ready' },
];

export const complianceControls: ComplianceControl[] = [
  { id: 'soc2', framework: 'SOC 2', control: 'Security, availability and confidentiality readiness', status: 'ready', evidence: 'Audit logs, monitoring, access reviews, incident response and release controls.' },
  { id: 'iso', framework: 'ISO 27001', control: 'Information security management control mapping', status: 'ready', evidence: 'Risk register, asset protection, vendor reviews and policy evidence repository.' },
  { id: 'gdpr', framework: 'GDPR', control: 'Privacy requests, consent, retention and processing records', status: 'ready', evidence: 'Privacy management and data lifecycle controls from earlier phases.' },
  { id: 'hipaa', framework: 'HIPAA', control: 'Administrative, physical and technical safeguard readiness', status: 'watch', evidence: 'Safeguard mapping ready; certification requires external scope confirmation.' },
  { id: 'pci', framework: 'PCI DSS', control: 'Payment data handling and vendor boundary readiness', status: 'watch', evidence: 'Payment provider structure exists; cardholder data scope must remain provider-hosted.' },
];

export const trustCenterDocuments: TrustCenterDocument[] = [
  { id: 'security-practices', title: 'Security Practices', audience: 'Enterprise buyers', status: 'ready', summary: 'Encryption, RBAC, audit logging, monitoring, incident response and vulnerability management overview.' },
  { id: 'compliance-status', title: 'Compliance Status', audience: 'Compliance teams', status: 'ready', summary: 'SOC 2, ISO 27001, GDPR, HIPAA and PCI DSS readiness posture with evidence availability.' },
  { id: 'uptime', title: 'Uptime Information', audience: 'Executives', status: 'ready', summary: 'Production deployment and monitoring foundation with SLO-oriented reliability reporting.' },
  { id: 'privacy', title: 'Privacy Commitments', audience: 'Legal and privacy teams', status: 'ready', summary: 'Consent, retention, privacy requests and data processing commitments.' },
  { id: 'trust-docs', title: 'Trust Documentation', audience: 'Security reviewers', status: 'watch', summary: 'Controlled evidence release workflow for security questionnaires and audit artifacts.' },
];

export const privacyControls: PrivacyControl[] = [
  { id: 'consent', area: 'Consent Management', policy: 'Capture, update and prove consent by tenant and workspace context.', status: 'ready', owner: 'Privacy Operations' },
  { id: 'retention', area: 'Data Retention Policies', policy: 'Retention schedules align with data governance and compliance requirements.', status: 'ready', owner: 'Data Governance' },
  { id: 'requests', area: 'Privacy Requests', policy: 'Access, deletion and export requests are tracked to completion.', status: 'ready', owner: 'Privacy Operations' },
  { id: 'processing', area: 'Data Processing Records', policy: 'Processing records define purpose, system, retention and lawful basis.', status: 'ready', owner: 'Legal Operations' },
];

export const dataProtectionControls: DataProtectionControl[] = [
  { id: 'encryption', control: 'Encryption Validation', validation: 'TLS ingress, database SSL, backup encryption and secret management checks.', status: 'watch', evidence: 'Production deployment artifacts enforce HTTPS and secret separation.' },
  { id: 'access', control: 'Access Reviews', validation: 'Quarterly RBAC, API key, admin and AI agent access review.', status: 'ready', evidence: 'IAM and approval foundations exist across platform phases.' },
  { id: 'classification', control: 'Data Classification', validation: 'Classify customer, employee, finance, security and AI memory records.', status: 'ready', evidence: 'Data governance and privacy automation phases mapped classifications.' },
  { id: 'handling', control: 'Data Handling Policies', validation: 'Handling policies define storage, access, sharing and deletion rules.', status: 'ready', evidence: 'Records lifecycle, retention and compliance automation foundations.' },
];

export const enterpriseRisks: EnterpriseRisk[] = [
  { id: 'dependency', risk: 'Dependency remediation delay', score: 46, mitigation: 'Schedule framework-compatible remediation path before GA.', monitoring: 'Weekly audit snapshot and release gate review.' },
  { id: 'enterprise-evidence', risk: 'Incomplete buyer evidence package', score: 34, mitigation: 'Maintain evidence repository and trust center readiness checklist.', monitoring: 'Evidence freshness scoring by owner.' },
  { id: 'ai-governance', risk: 'AI action boundary drift', score: 31, mitigation: 'Validate model, prompt, agent permission and approval policies.', monitoring: 'AI governance validation dashboard.' },
  { id: 'vendor', risk: 'Vendor compliance lag', score: 28, mitigation: 'Track vendor security questionnaires and review cadence.', monitoring: 'Vendor risk review schedule.' },
];

export const incidentPlans: IncidentPlan[] = [
  { id: 'sev1', severity: 'critical', responsePlan: 'Incident commander, customer comms, security lead and executive bridge within 15 minutes.', status: 'ready', postMortem: 'Required within 5 business days.' },
  { id: 'sev2', severity: 'high', responsePlan: 'Security operations triage, owner assignment and mitigation plan within 1 hour.', status: 'ready', postMortem: 'Required within 7 business days.' },
  { id: 'sev3', severity: 'medium', responsePlan: 'Risk review, remediation owner and validation evidence within 2 business days.', status: 'ready', postMortem: 'Required when customer-facing.' },
  { id: 'sev4', severity: 'low', responsePlan: 'Tracked in security backlog with SLA and validation notes.', status: 'ready', postMortem: 'Optional trend review.' },
];

export const evidenceItems: EvidenceItem[] = [
  { id: 'audit-logs', type: 'Audit Evidence', title: 'Audit log validation report', owner: 'Security Operations', retention: '7 years' },
  { id: 'security-review', type: 'Security Reviews', title: 'Phase 63 security review packet', owner: 'Platform Security', retention: '3 years' },
  { id: 'policies', type: 'Compliance Documents', title: 'Privacy, retention and access control policies', owner: 'Compliance', retention: 'Current plus 7 years' },
  { id: 'validation', type: 'Validation Reports', title: 'Build, route smoke, Prisma and audit validation', owner: 'Release Engineering', retention: 'All release candidates' },
];

export const vendorSecurityReviews: VendorSecurityReview[] = [
  { id: 'openai', vendor: 'AI provider stack', risk: 'medium', compliance: 'AI data protection and provider governance review', nextReview: 'Before GA' },
  { id: 'cloud', vendor: 'Cloud infrastructure provider', risk: 'high', compliance: 'SOC 2, ISO 27001 and regional data controls', nextReview: 'Quarterly' },
  { id: 'payments', vendor: 'Payment processors', risk: 'high', compliance: 'PCI DSS scope and hosted payment boundary', nextReview: 'Before paid launch' },
  { id: 'email', vendor: 'Email delivery provider', risk: 'medium', compliance: 'DPA, privacy and deliverability security review', nextReview: 'Quarterly' },
];

export const aiSecurityChecks: AiSecurityCheck[] = [
  { id: 'governance', domain: 'AI Governance', validation: 'Model registry, decision records, audit and approval workflows are mapped.', status: 'ready', evidence: 'AI governance, modelops and decision intelligence phases.' },
  { id: 'model-security', domain: 'Model Security', validation: 'Provider abstraction and model deployment controls are reviewed.', status: 'ready', evidence: 'AI provider and ModelOps architecture.' },
  { id: 'prompt-security', domain: 'Prompt Security', validation: 'Prompt logging, redaction and tenant isolation are validated.', status: 'watch', evidence: 'Prompt logging exists; redaction evidence must be refreshed before GA.' },
  { id: 'agent-permissions', domain: 'Agent Permissions', validation: 'Agent capabilities require RBAC, approval policy and action audit.', status: 'ready', evidence: 'Autonomous agent execution layer and approval system.' },
  { id: 'data-protection', domain: 'Data Protection', validation: 'AI memory and retrieval access are tenant and workspace isolated.', status: 'ready', evidence: 'Knowledge graph, secure retrieval and AI memory phases.' },
];

export const enterpriseTrustNavigation = [
  { group: 'Security', items: ['Audit Center', 'Vulnerabilities', 'Operations', 'Incidents'] },
  { group: 'Compliance', items: ['Frameworks', 'Evidence', 'Privacy', 'Data Protection'] },
  { group: 'Trust', items: ['Trust Center', 'Risk', 'Vendors', 'AI Governance'] },
];

export const phase63Routes: EnterpriseTrustRoute[] = [
  { path: '/enterprise-trust', module: 'Enterprise Trust Workspace', marker: 'Security Audit Center' },
  { path: '/enterprise-trust/security-audit', module: 'Security Audit Center', marker: 'Security Score' },
  { path: '/enterprise-trust/vulnerabilities', module: 'Vulnerability Management', marker: 'OWASP Top 10' },
  { path: '/enterprise-trust/security-operations', module: 'Security Operations Dashboard', marker: 'Security Events' },
  { path: '/enterprise-trust/compliance', module: 'Compliance Management', marker: 'SOC 2' },
  { path: '/enterprise-trust/trust-center', module: 'Trust Center', marker: 'Security Practices' },
  { path: '/trust-center', module: 'Public Trust Center', marker: 'Privacy Commitments' },
  { path: '/enterprise-trust/privacy', module: 'Privacy Management', marker: 'Consent Management' },
  { path: '/enterprise-trust/data-protection', module: 'Data Protection Framework', marker: 'Encryption Validation' },
  { path: '/enterprise-trust/risk-management', module: 'Risk Management', marker: 'Enterprise Risks' },
  { path: '/enterprise-trust/incidents', module: 'Incident Response Center', marker: 'Incident Tracking' },
  { path: '/enterprise-trust/evidence', module: 'Compliance Evidence Repository', marker: 'Audit Evidence' },
  { path: '/enterprise-trust/vendor-security', module: 'Vendor Security Management', marker: 'Vendor Risk Reviews' },
  { path: '/enterprise-trust/ai-security', module: 'AI Security & Governance Validation', marker: 'Prompt Security' },
  { path: '/workspace/enterprise-trust', module: 'Enterprise Trust compatibility route', marker: 'Security Audit Center' },
];
