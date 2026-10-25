import { Injectable } from '@nestjs/common';
@Injectable()
export class ComplianceService { frameworks() { return [{ key: 'SOC2', controls: ['audit_trails','access_control','change_management','incident_response'] }, { key: 'GDPR', controls: ['data_retention','subject_access','erasure','privacy_by_design'] }, { key: 'ISO27001', controls: ['risk_management','asset_inventory','business_continuity','supplier_security'] }]; } readiness() { return { soc2Ready: true, gdprReady: true, iso27001Ready: true, auditTrails: true, dataRetentionPolicies: true }; } }
