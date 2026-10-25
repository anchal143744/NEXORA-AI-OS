import { Injectable } from '@nestjs/common';

export interface IndustryTemplateDefinition {
  industry: string;
  recommendedModules: string[];
  recommendedKpis: string[];
  recommendedWorkflows: string[];
  recommendedAgents: string[];
  recommendedDashboards: string[];
}

const templates: IndustryTemplateDefinition[] = [
  { industry: 'saas', recommendedModules: ['crm','finance','projects','analytics','workflows','ai'], recommendedKpis: ['mrr','arr','churn_rate','activation_rate','runway'], recommendedWorkflows: ['lead_nurture','trial_conversion','renewal_risk'], recommendedAgents: ['sales','finance','analytics','executive'], recommendedDashboards: ['executive','revenue','product_growth'] },
  { industry: 'agency', recommendedModules: ['crm','projects','tasks','finance','documents','analytics'], recommendedKpis: ['pipeline_value','utilization','project_margin','client_retention'], recommendedWorkflows: ['proposal_followup','project_kickoff','invoice_reminder'], recommendedAgents: ['crm','operations','finance','customer_success'], recommendedDashboards: ['agency_ops','delivery','finance'] },
  { industry: 'ecommerce', recommendedModules: ['crm','inventory','finance','analytics','integrations','workflows'], recommendedKpis: ['gmv','conversion_rate','average_order_value','return_rate','inventory_turnover'], recommendedWorkflows: ['abandoned_cart','low_stock','refund_review'], recommendedAgents: ['sales','operations','analytics','customer_success'], recommendedDashboards: ['commerce','inventory','customer'] },
  { industry: 'retail', recommendedModules: ['inventory','finance','crm','hr','analytics'], recommendedKpis: ['same_store_sales','stockout_rate','gross_margin','customer_frequency'], recommendedWorkflows: ['low_stock','daily_close','loyalty_followup'], recommendedAgents: ['operations','finance','customer_success'], recommendedDashboards: ['retail_ops','inventory','finance'] },
  { industry: 'healthcare', recommendedModules: ['patients','hr','finance','documents','compliance','analytics'], recommendedKpis: ['patient_volume','appointment_utilization','claim_cycle_time','staff_utilization'], recommendedWorkflows: ['appointment_followup','document_review','billing_review'], recommendedAgents: ['operations','hr','finance','executive'], recommendedDashboards: ['care_ops','finance','compliance'] },
  { industry: 'manufacturing', recommendedModules: ['inventory','finance','projects','hr','analytics','workflows'], recommendedKpis: ['production_output','defect_rate','inventory_turnover','on_time_delivery'], recommendedWorkflows: ['quality_issue','reorder_material','maintenance_schedule'], recommendedAgents: ['operations','finance','analytics'], recommendedDashboards: ['plant_ops','supply_chain','quality'] },
  { industry: 'education', recommendedModules: ['crm','hr','finance','documents','analytics'], recommendedKpis: ['enrollment','retention','attendance','program_margin'], recommendedWorkflows: ['enquiry_followup','admission_review','fee_reminder'], recommendedAgents: ['crm','operations','finance'], recommendedDashboards: ['education_ops','admissions','finance'] },
  { industry: 'finance', recommendedModules: ['crm','finance','documents','compliance','analytics','workflows'], recommendedKpis: ['aum','risk_exposure','revenue','compliance_sla'], recommendedWorkflows: ['kyc_review','risk_alert','client_review'], recommendedAgents: ['finance','analytics','executive'], recommendedDashboards: ['financial_ops','risk','executive'] },
  { industry: 'logistics', recommendedModules: ['projects','tasks','finance','analytics','integrations','workflows'], recommendedKpis: ['on_time_delivery','cost_per_shipment','fleet_utilization','exception_rate'], recommendedWorkflows: ['delivery_exception','route_review','invoice_reconciliation'], recommendedAgents: ['operations','finance','analytics'], recommendedDashboards: ['logistics_ops','fleet','finance'] },
  { industry: 'consulting', recommendedModules: ['crm','projects','documents','finance','analytics','ai'], recommendedKpis: ['pipeline_value','billable_utilization','project_margin','client_health'], recommendedWorkflows: ['proposal_followup','engagement_review','renewal_plan'], recommendedAgents: ['crm','operations','executive','analytics'], recommendedDashboards: ['consulting_ops','delivery','executive'] },
];

@Injectable()
export class IndustryRegistryService {
  list() { return templates; }
  get(industry: string) { return templates.find(template => template.industry === industry) ?? templates[0]; }
}
