import { Injectable } from '@nestjs/common';
import { BusinessClassification } from '../classification/business-classification.service';
import { IndustryTemplateDefinition } from '../registry/industry-registry.service';

@Injectable()
export class WorkspaceRecommendationEngine {
  generate(input: { classification: BusinessClassification; template: IndustryTemplateDefinition; enabledModules: string[] }) {
    const missingModules = input.template.recommendedModules.filter(module => !input.enabledModules.includes(module));
    const recommendations = [
      ...missingModules.map(module => ({ type: 'module', title: `Enable ${module}`, summary: `${module} is recommended for ${input.classification.industry}.`, payload: { module } })),
      ...input.template.recommendedKpis.map(kpi => ({ type: 'kpi', title: `Track ${kpi}`, summary: `${kpi} should be part of the operating scorecard.`, payload: { kpi } })),
      ...input.template.recommendedWorkflows.map(workflow => ({ type: 'workflow', title: `Automate ${workflow}`, summary: `Create an automation blueprint for ${workflow}.`, payload: { workflow } })),
      ...input.template.recommendedAgents.map(agent => ({ type: 'agent', title: `Activate ${agent} agent`, summary: `${agent} agent should support this workspace profile.`, payload: { agent } })),
    ];
    return recommendations;
  }
}
