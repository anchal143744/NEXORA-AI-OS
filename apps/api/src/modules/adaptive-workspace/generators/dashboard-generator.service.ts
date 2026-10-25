import { Injectable } from '@nestjs/common';
import { BusinessClassification } from '../classification/business-classification.service';
import { IndustryTemplateDefinition } from '../registry/industry-registry.service';

@Injectable()
export class DashboardGeneratorService {
  generate(input: { classification: BusinessClassification; template: IndustryTemplateDefinition; role?: string; modules: Array<{ moduleKey: string }> }) {
    const enabled = new Set(input.modules.map(module => module.moduleKey));
    return input.template.recommendedDashboards.map((dashboard, index) => ({ key: dashboard, title: `${title(dashboard)} Dashboard`, role: input.role ?? 'owner', industry: input.classification.industry, layout: { columns: input.classification.recommendedDepth === 'enterprise' ? 12 : 8, density: input.classification.recommendedDepth }, widgets: input.template.recommendedKpis.filter(kpi => acceptsKpi(kpi, enabled)).slice(0, 8).map((kpi, widgetIndex) => ({ key: `${dashboard}.${kpi}`, type: widgetIndex % 3 === 0 ? 'trend' : 'metric', kpi, position: { x: (widgetIndex % 4) * 3, y: Math.floor(widgetIndex / 4) * 3, w: 3, h: 3 } })), order: (index + 1) * 10 }));
  }
}
function acceptsKpi(kpi: string, modules: Set<string>) { if (kpi.includes('inventory')) return modules.has('inventory'); if (kpi.includes('pipeline') || kpi.includes('conversion') || kpi.includes('client') || kpi.includes('lead')) return modules.has('crm'); if (kpi.includes('revenue') || kpi.includes('margin') || kpi.includes('cash') || kpi.includes('runway')) return modules.has('finance'); return true; }
function title(value: string) { return value.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); }
