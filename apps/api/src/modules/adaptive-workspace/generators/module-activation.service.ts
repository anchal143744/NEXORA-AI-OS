import { Injectable } from '@nestjs/common';
import { BusinessClassification } from '../classification/business-classification.service';
import { IndustryTemplateDefinition } from '../registry/industry-registry.service';

const goalModules: Record<string, string[]> = {
  grow_revenue: ['crm','finance','analytics'],
  improve_operations: ['projects','tasks','workflows','analytics'],
  automate_workflows: ['workflows','integrations','ai'],
  improve_cashflow: ['finance','analytics','workflows'],
  manage_team: ['hr','projects','tasks'],
  expand_channels: ['crm','integrations','analytics'],
};

@Injectable()
export class ModuleActivationService {
  generate(classification: BusinessClassification, template: IndustryTemplateDefinition) {
    const goalBased = classification.goals.flatMap(goal => goalModules[goal] ?? []);
    const sizeBased = ['complex','global'].includes(classification.operatingComplexity) ? ['operations','compliance','integrations'] : [];
    return [...new Set([...template.recommendedModules, ...goalBased, ...sizeBased])].map((moduleKey, index) => ({ moduleKey, enabled: true, source: template.recommendedModules.includes(moduleKey) ? 'industry' : 'adaptive_rule', order: (index + 1) * 10 }));
  }
}
