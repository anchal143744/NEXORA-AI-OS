import { Injectable } from '@nestjs/common';
import { ManufacturingCommandService } from './manufacturing-command.service';
import { ManufacturingQueryService } from './manufacturing-query.service';

@Injectable()
export class ManufacturingCqrsService {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService) {}

  commandHandlers() {
    return [
      'createPlant',
      'createProductionLine',
      'createWorkCenter',
      'createFactoryResource',
      'createBom',
      'createProductionPlan',
      'createProductionOrder',
      'createExecutionRun',
      'createQualityInspection',
      'createMaintenancePrediction',
      'createMetric',
      'createDigitalTwinSnapshot',
      'createCopilotQuery',
    ];
  }

  queryHandlers() {
    return [
      'plants',
      'lines',
      'workCenters',
      'resources',
      'boms',
      'plans',
      'orders',
      'executionRuns',
      'inspections',
      'maintenancePredictions',
      'metrics',
      'risks',
      'analyticsDashboard',
    ];
  }

  get commandBus() { return this.commands; }
  get queryBus() { return this.queries; }
}

