import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { SecurityAuditController } from './controllers/security-audit.controller';
import { SecurityAlertsController } from './controllers/security-alerts.controller';
import { SecurityIncidentsController } from './controllers/security-incidents.controller';
import { SecurityIntelligenceController } from './controllers/security-intelligence.controller';
import { SecurityRiskController } from './controllers/security-risk.controller';
import { SecurityController } from './controllers/security.controller';
import { ThreatDetectionController } from './controllers/threat-detection.controller';
import { ZeroTrustController } from './controllers/zero-trust.controller';
import { SecurityAuditService } from './security-audit.service';
import { SecurityCommandService } from './security-command.service';
import { SecurityIntelligenceService } from './security-intelligence.service';
import { SecurityRiskService } from './security-risk.service';
import { ThreatDetectionService } from './threat-detection.service';
import { ZeroTrustService } from './zero-trust.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [SecurityController, SecurityIntelligenceController, ThreatDetectionController, SecurityAuditController, SecurityIncidentsController, SecurityAlertsController, ZeroTrustController, SecurityRiskController],
  providers: [SecurityIntelligenceService, SecurityCommandService, ThreatDetectionService, SecurityRiskService, SecurityAuditService, ZeroTrustService],
  exports: [SecurityIntelligenceService, SecurityCommandService, ThreatDetectionService, SecurityRiskService, SecurityAuditService, ZeroTrustService],
})
export class SecurityIntelligenceModule {}