import type { DiscoveryStepKey } from '@/types/discovery';

export const conversationalPrompts: Record<DiscoveryStepKey, string> = {
  business: 'Tell me how the business makes money, what it sells, and what customers expect.',
  industry: 'Give me market hints. I will infer the strongest industry fit from your answers.',
  team: 'Describe the teams that need access and where coordination breaks down.',
  software: 'List the tools, spreadsheets and manual processes currently running the business.',
  goals: 'Choose the outcomes the operating system should optimize first.',
  intelligence: 'I will assemble the AI business profile and score readiness.',
  preview: 'Review the workspace blueprint before creation.',
  generate: 'Generate the workspace when the blueprint looks right.',
};

export const departmentOptions = ['Sales', 'Operations', 'Finance', 'Customer Success', 'HR', 'Product', 'Support', 'IT'];
export const softwareOptions = ['Salesforce', 'HubSpot', 'QuickBooks', 'Slack', 'Microsoft 365', 'Google Workspace', 'Shopify', 'SAP', 'Spreadsheet tracking', 'Manual email follow-ups', 'Disconnected documents'];
export const painOptions = ['Manual follow-up', 'Slow approvals', 'Disconnected reporting', 'Duplicate data', 'No executive visibility', 'Poor handoffs'];
export const goalOptions = ['Revenue growth', 'Operational automation', 'Customer retention', 'Cost optimization', 'Global expansion', 'Faster onboarding'];
