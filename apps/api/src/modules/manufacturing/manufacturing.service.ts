import { Injectable } from '@nestjs/common';
import { ManufacturingCqrsService } from './manufacturing-cqrs.service';
import { ManufacturingQueryService } from './manufacturing-query.service';

@Injectable()
export class ManufacturingService {
  constructor(private readonly queries: ManufacturingQueryService, private readonly cqrs: ManufacturingCqrsService) {}

  async dashboard() {
    const dashboard = await this.queries.analyticsDashboard();
    return {
      ...dashboard,
      cqrs: {
        commandHandlers: this.cqrs.commandHandlers(),
        queryHandlers: this.cqrs.queryHandlers(),
      },
      readiness: {
        modules: ['Manufacturing Foundation', 'BOM', 'Production Planning', 'MES', 'Factory Resources', 'QMS', 'Predictive Maintenance', 'Cost Intelligence', 'Analytics', 'Risk Intelligence', 'Digital Twin', 'AI Copilot'],
        tenantIsolation: true,
        eventDriven: true,
        cqrsEnabled: true,
        openApiReady: true,
      },
    };
  }
}

