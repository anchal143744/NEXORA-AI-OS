import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventRegistry } from './registry/event-registry';

@ApiTags('Event Bus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly registry: EventRegistry) {}
  @Get('registry') listRegistry() { return this.registry.list(); }
}
