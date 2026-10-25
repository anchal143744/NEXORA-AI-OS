import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { CalendarService } from './calendar.service';
import { CommunicationsIndexService } from './communications-index.service';
import { CommunicationsService } from './communications.service';
import { AnnouncementsController } from './controllers/announcements.controller';
import { AvailabilityController } from './controllers/availability.controller';
import { CalendarEventsController } from './controllers/calendar-events.controller';
import { CalendarsController } from './controllers/calendars.controller';
import { CommunicationsController } from './controllers/communications.controller';
import { ConversationsController } from './controllers/conversations.controller';
import { MeetingSummariesController } from './controllers/meeting-summaries.controller';
import { MeetingsController } from './controllers/meetings.controller';
import { MessagesController } from './controllers/messages.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { RemindersController } from './controllers/reminders.controller';
import { SchedulingController } from './controllers/scheduling.controller';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [CommunicationsController, ConversationsController, MessagesController, AnnouncementsController, MeetingsController, MeetingSummariesController, CalendarsController, CalendarEventsController, SchedulingController, RemindersController, AvailabilityController, NotificationsController],
  providers: [CommunicationsService, MeetingsService, CalendarService, CommunicationsIndexService],
  exports: [CommunicationsService, MeetingsService, CalendarService, CommunicationsIndexService],
})
export class CommunicationsModule {}