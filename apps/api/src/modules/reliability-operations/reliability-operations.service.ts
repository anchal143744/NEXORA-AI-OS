import { Injectable } from '@nestjs/common';
import { GlobalOperationsService } from './global-operations.service';
import { IncidentManagementService } from './incident-management.service';
import { ReliabilityHealthService } from './reliability-health.service';
import { ScalingOperationsService } from './scaling-operations.service';
import { SreAutomationService } from './sre-automation.service';

@Injectable()
export class ReliabilityOperationsService {
  constructor(
    private readonly health: ReliabilityHealthService,
    private readonly incidents: IncidentManagementService,
    private readonly scaling: ScalingOperationsService,
    private readonly globalOps: GlobalOperationsService,
    private readonly sre: SreAutomationService,
  ) {}

  async commandCenter() {
    const [health, incidents, scaling, globalOps, sre] = await Promise.all([this.health.reliabilityDashboard(), this.incidents.incidentCenter(), this.scaling.operations(), this.globalOps.dashboard(), this.sre.dashboard()]);
    return { health, incidents, scaling, globalOps, sre, summary: { reliabilityScore: health.summary.latestScore, degradedServices: health.summary.degradedServiceCount, openIncidents: incidents.summary.openIncidentCount, activeFailovers: globalOps.summary.activeFailoverCount, openSreAlerts: sre.summary.openAlerts } };
  }

  dashboard() { return this.commandCenter(); }
  intelligence() { return this.sre.reliabilityIntelligence(); }
  globalHealth() { return this.globalOps.dashboard(); }
}