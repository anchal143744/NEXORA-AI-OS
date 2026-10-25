import { Injectable } from '@nestjs/common';
import { KpiDefinition } from './kpi.contracts';
export const CORE_KPIS: KpiDefinition[] = [
  { key: 'crm.lead_count', name: 'Lead Count', category: 'crm', unit: 'count', description: 'Total active leads' },
  { key: 'crm.conversion_rate', name: 'Conversion Rate', category: 'crm', unit: 'percent', description: 'Closed-won opportunities divided by leads' },
  { key: 'crm.pipeline_value', name: 'Sales Pipeline Value', category: 'crm', unit: 'currency', description: 'Open opportunity value' },
  { key: 'crm.customer_acquisition_cost', name: 'Customer Acquisition Cost', category: 'crm', unit: 'currency', description: 'Expense divided by acquired customers' },
  { key: 'crm.customer_lifetime_value', name: 'Customer Lifetime Value', category: 'crm', unit: 'currency', description: 'Revenue divided by customers' },
  { key: 'finance.revenue', name: 'Revenue', category: 'finance', unit: 'currency', description: 'Recognized revenue' },
  { key: 'finance.profit', name: 'Profit', category: 'finance', unit: 'currency', description: 'Revenue minus expenses' },
  { key: 'finance.expenses', name: 'Expenses', category: 'finance', unit: 'currency', description: 'Recognized expenses' },
  { key: 'finance.cash_flow', name: 'Cash Flow', category: 'finance', unit: 'currency', description: 'Net cashflow' },
  { key: 'finance.burn_rate', name: 'Burn Rate', category: 'finance', unit: 'currency', description: 'Monthly expense velocity' },
  { key: 'finance.runway', name: 'Runway', category: 'finance', unit: 'months', description: 'Estimated operating runway' },
  { key: 'hr.employee_count', name: 'Employee Count', category: 'hr', unit: 'count', description: 'Active employees' },
  { key: 'hr.attendance_rate', name: 'Attendance Rate', category: 'hr', unit: 'percent', description: 'Present attendance ratio' },
  { key: 'hr.productivity_score', name: 'Productivity Score', category: 'hr', unit: 'score', description: 'Task completion per active employee' },
  { key: 'hr.retention_rate', name: 'Retention Rate', category: 'hr', unit: 'percent', description: 'Active employees over total employee records' },
  { key: 'operations.tasks_completed', name: 'Tasks Completed', category: 'operations', unit: 'count', description: 'Completed tasks' },
  { key: 'operations.projects_completed', name: 'Projects Completed', category: 'operations', unit: 'count', description: 'Completed projects' },
  { key: 'operations.workflow_success_rate', name: 'Workflow Success Rate', category: 'operations', unit: 'percent', description: 'Succeeded workflow executions' },
  { key: 'operations.automation_coverage', name: 'Automation Coverage', category: 'operations', unit: 'percent', description: 'Active workflows over total workflows' },
];
@Injectable()
export class KpiRegistry { list() { return CORE_KPIS; } categories() { return [...new Set(CORE_KPIS.map(k => k.category))]; } keys() { return CORE_KPIS.map(k => k.key); } }
