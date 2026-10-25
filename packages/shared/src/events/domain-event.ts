export interface DomainEventEnvelope<TPayload = unknown> {
  id: string;
  tenantId: string;
  workspaceId?: string;
  type: string;
  source: string;
  payload: TPayload;
  occurredAt: string;
  correlationId?: string;
}
