export interface EventContract<TPayload = Record<string, unknown>> {
  type: string;
  version: number;
  payloadSchemaKey: string;
  examplePayload?: TPayload;
}
