import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard {
  validate(client: Socket) {
    const tenantId = String(client.handshake.auth?.tenantId ?? client.handshake.headers['x-tenant-id'] ?? '');
    const workspaceId = client.handshake.auth?.workspaceId ? String(client.handshake.auth.workspaceId) : undefined;
    const userId = client.handshake.auth?.userId ? String(client.handshake.auth.userId) : undefined;
    if (!tenantId) throw new UnauthorizedException('tenantId is required for realtime connection');
    client.data.tenantId = tenantId;
    client.data.workspaceId = workspaceId;
    client.data.userId = userId;
    return { tenantId, workspaceId, userId };
  }
}
