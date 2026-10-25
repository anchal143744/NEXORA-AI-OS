import { Module } from '@nestjs/common';
import { CommunicationsModule } from '../communications/communications.module';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ContactCenterController } from './controllers/contact-center.controller';
import { CommunicationChannelsController } from './controllers/communication-channels.controller';
import { ConversationIntelligenceController } from './controllers/conversation-intelligence.controller';
import { CustomerIdentityController } from './controllers/customer-identity.controller';
import { OmnichannelConversationsController } from './controllers/omnichannel-conversations.controller';
import { OmnichannelMessagesController } from './controllers/omnichannel-messages.controller';
import { VoiceAgentsController } from './controllers/voice-agents.controller';
import { VoiceAiController } from './controllers/voice-ai.controller';
import { ContactCenterService } from './contact-center.service';
import { ConversationIntelligenceService } from './conversation-intelligence.service';
import { OmnichannelEngagementService } from './omnichannel-engagement.service';
import { VoiceAgentsService } from './voice-agents.service';
import { VoiceAiService } from './voice-ai.service';

@Module({
  imports: [TenantsModule, EventsModule, CommunicationsModule],
  controllers: [VoiceAiController, ContactCenterController, OmnichannelConversationsController, OmnichannelMessagesController, CommunicationChannelsController, CustomerIdentityController, ConversationIntelligenceController, VoiceAgentsController],
  providers: [VoiceAiService, ContactCenterService, OmnichannelEngagementService, ConversationIntelligenceService, VoiceAgentsService],
  exports: [VoiceAiService, ContactCenterService, OmnichannelEngagementService, ConversationIntelligenceService, VoiceAgentsService],
})
export class ContactCenterModule {}
