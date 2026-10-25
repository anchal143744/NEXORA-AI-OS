import { Module, forwardRef } from '@nestjs/common';
import { RealtimeGateway } from './gateways/realtime.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { RealtimeChannelService } from './realtime-channel.service';

@Module({
  providers: [WsAuthGuard, RealtimeGateway, RealtimeChannelService],
  exports: [RealtimeGateway, RealtimeChannelService],
})
export class RealtimeModule {}
