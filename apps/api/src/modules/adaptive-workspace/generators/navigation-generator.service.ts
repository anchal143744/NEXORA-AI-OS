import { Injectable } from '@nestjs/common';

const groupMap: Record<string, string> = { crm: 'operate', finance: 'operate', hr: 'operate', inventory: 'operate', projects: 'operate', tasks: 'operate', documents: 'operate', patients: 'operate', analytics: 'intelligence', ai: 'intelligence', workflows: 'automation', integrations: 'system', compliance: 'system', operations: 'operate' };

@Injectable()
export class NavigationGeneratorService {
  generate(modules: Array<{ moduleKey: string; order: number }>) {
    return modules.sort((a,b)=>a.order-b.order).map(module => ({ key: module.moduleKey, label: title(module.moduleKey), group: groupMap[module.moduleKey] ?? 'operate', route: `/workspace/${module.moduleKey}`, source: 'workspace_blueprint', order: module.order }));
  }
}
function title(value: string) { return value.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); }
