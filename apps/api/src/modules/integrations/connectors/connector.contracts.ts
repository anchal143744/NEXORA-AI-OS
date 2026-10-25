export const SUPPORTED_CONNECTORS = ['google','microsoft','slack','discord','hubspot','salesforce','stripe','razorpay','shopify','woocommerce','notion','github','gitlab','openai','anthropic','twilio','whatsapp_business'] as const;
export type ConnectorKey = (typeof SUPPORTED_CONNECTORS)[number];
export interface ConnectorDefinition { key: ConnectorKey; name: string; category: string; auth: 'oauth2' | 'api_key' | 'secret'; scopes: string[]; webhookSupport: boolean; syncSupport: 'one_way' | 'two_way' | 'realtime' | 'scheduled'; }
export interface ConnectorExecution { connectorKey: ConnectorKey; operation: string; payload: Record<string, unknown>; integrationId?: string; }
