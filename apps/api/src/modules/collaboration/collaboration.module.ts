import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AiCollaborationController } from './ai/ai-collaboration.controller';
import { AiCollaborationService } from './ai/ai-collaboration.service';
import { CollaborationController } from './collaboration.controller';
import { CollaborationFeedService } from './collaboration-feed.service';
import { CollaborationIndexService } from './collaboration-index.service';
import { DecisionRoomsController } from './decisions/decision-rooms.controller';
import { DecisionRoomsService } from './decisions/decision-rooms.service';
import { DiscussionsController } from './discussions/discussions.controller';
import { DiscussionsService } from './discussions/discussions.service';
import { KnowledgeController } from './knowledge/knowledge.controller';
import { KnowledgeSpacesController } from './knowledge/knowledge-spaces.controller';
import { KnowledgeSpacesService } from './knowledge/knowledge-spaces.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [KnowledgeSpacesController, KnowledgeController, DiscussionsController, DecisionRoomsController, CollaborationController, AiCollaborationController],
  providers: [KnowledgeSpacesService, DiscussionsService, DecisionRoomsService, CollaborationFeedService, CollaborationIndexService, AiCollaborationService],
  exports: [KnowledgeSpacesService, DiscussionsService, DecisionRoomsService, CollaborationFeedService, CollaborationIndexService, AiCollaborationService],
})
export class CollaborationModule {}