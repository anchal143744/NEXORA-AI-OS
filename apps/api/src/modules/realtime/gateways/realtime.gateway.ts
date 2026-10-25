import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { REALTIME_CHANNELS, RealtimeChannel } from '../channels/realtime-channel';
import { WsAuthGuard } from '../guards/ws-auth.guard';

@WebSocketGateway({ namespace: '/realtime', cors: true })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;
  constructor(private readonly wsAuth: WsAuthGuard) {}

  handleConnection(client: Socket) {
    const span = tracingBackend.startSpan('websocket.connect', { kind: 'server', attributes: { socketId: client.id } });
    try {
      const context = this.wsAuth.validate(client);
      client.join(`tenant:${context.tenantId}`);
      Object.values(REALTIME_CHANNELS).forEach((channel) => client.join(`tenant:${context.tenantId}:${channel}`));
      if (context.workspaceId) Object.values(REALTIME_CHANNELS).forEach((channel) => client.join(`tenant:${context.tenantId}:workspace:${context.workspaceId}:${channel}`));
      telemetryRegistry.incrementCounter('nexora_websocket_connections_total', 1, { status: 'ok', tenant_id: context.tenantId });
      tracingBackend.finishSpan(span, 'OK', { tenantId: context.tenantId, workspaceId: context.workspaceId });
    } catch (error) {
      telemetryRegistry.incrementCounter('nexora_websocket_connections_total', 1, { status: 'error' });
      tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' });
      throw error;
    }
  }

  @SubscribeMessage('subscribe')
  subscribe(@ConnectedSocket() client: Socket, @MessageBody() body: { channel: RealtimeChannel; workspaceId?: string }) {
    const tenantId = client.data.tenantId;
    const room = body.workspaceId ? `tenant:${tenantId}:workspace:${body.workspaceId}:${body.channel}` : `tenant:${tenantId}:${body.channel}`;
    client.join(room);
    telemetryRegistry.incrementCounter('nexora_websocket_subscriptions_total', 1, { channel: body.channel, tenant_id: tenantId });
    return { subscribed: true, room };
  }

  publish(room: string, event: string, payload: unknown) { telemetryRegistry.incrementCounter('nexora_websocket_events_published_total', 1, { event }); this.server.to(room).emit(event, payload); }
}