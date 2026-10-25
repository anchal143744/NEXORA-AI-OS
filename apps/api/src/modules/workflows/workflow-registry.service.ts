import { Injectable } from '@nestjs/common';
import { WORKFLOW_ACTIONS, WORKFLOW_COMPONENTS, WORKFLOW_CONDITIONS, WORKFLOW_TRIGGERS } from './contracts/workflow-definition.contract';
@Injectable()
export class WorkflowRegistryService {
  components() { return WORKFLOW_COMPONENTS; }
  triggers() { return WORKFLOW_TRIGGERS; }
  conditions() { return WORKFLOW_CONDITIONS; }
  actions() { return WORKFLOW_ACTIONS; }
  snapshot() { return { components: this.components(), triggers: this.triggers(), conditions: this.conditions(), actions: this.actions() }; }
}
