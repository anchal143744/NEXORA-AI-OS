import { Injectable } from '@nestjs/common';

export interface ModuleMetadata {
  key: string;
  name: string;
  category: string;
  description: string;
  capabilities: string[];
}

@Injectable()
export class ModuleMetadataService {
  private readonly modules: ModuleMetadata[] = [
    { key: 'finance', name: 'Finance', category: 'operations', description: 'Invoices, expenses, revenue and cashflow.', capabilities: ['invoice', 'expense', 'revenue', 'cashflow'] },
    { key: 'crm', name: 'CRM', category: 'growth', description: 'Leads, customers, pipelines and opportunities.', capabilities: ['lead', 'customer', 'opportunity', 'pipeline'] },
    { key: 'hr', name: 'HR', category: 'people', description: 'Employees, departments and attendance.', capabilities: ['employee', 'department', 'attendance'] },
    { key: 'inventory', name: 'Inventory', category: 'operations', description: 'Items, stock movement and locations.', capabilities: ['item', 'movement'] },
    { key: 'projects', name: 'Projects', category: 'delivery', description: 'Projects, milestones and delivery execution.', capabilities: ['project'] },
    { key: 'tasks', name: 'Tasks', category: 'delivery', description: 'Tasks, assignments and status tracking.', capabilities: ['task', 'assignment'] },
    { key: 'documents', name: 'Documents', category: 'knowledge', description: 'Folders, metadata and upload records.', capabilities: ['folder', 'upload_record'] },
    { key: 'analytics', name: 'Analytics', category: 'intelligence', description: 'KPIs, metrics and business insight.', capabilities: ['metric', 'dashboard'] },
  ];

  discover() {
    return this.modules;
  }

  find(moduleKey: string) {
    return this.modules.find((module) => module.key === moduleKey);
  }
}
