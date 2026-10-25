import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddDecisionParticipantDto, CastDecisionVoteDto, CreateDecisionApprovalDto, CreateDecisionRecordDto, CreateDecisionRoomDto, DecideDecisionApprovalDto } from '../dto/collaboration.dto';
import { DecisionRoomsService } from './decision-rooms.service';

@ApiTags('Decision Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'decision-rooms', version: '1' })
export class DecisionRoomsController {
  constructor(private readonly rooms: DecisionRoomsService) {}

  @Get() list(@Query('status') status?: string, @Query('spaceId') spaceId?: string) { return this.rooms.rooms(status, spaceId); }
  @Post() create(@Body() dto: CreateDecisionRoomDto) { return this.rooms.createRoom(dto); }
  @Get('search') search(@Query('query') query = '') { return this.rooms.searchDecisions(query); }
  @Get(':id') get(@Param('id') id: string) { return this.rooms.getRoom(id); }
  @Post(':id/participants') participant(@Param('id') id: string, @Body() dto: AddDecisionParticipantDto) { return this.rooms.addParticipant(id, dto); }
  @Post(':id/votes') vote(@Param('id') id: string, @Body() dto: CastDecisionVoteDto) { return this.rooms.castVote(id, dto); }
  @Post(':id/approvals') approval(@Param('id') id: string, @Body() dto: CreateDecisionApprovalDto) { return this.rooms.createApproval(id, dto); }
  @Post(':id/approvals/:approvalId/decide') decideApproval(@Param('id') id: string, @Param('approvalId') approvalId: string, @Body() dto: DecideDecisionApprovalDto) { return this.rooms.decideApproval(id, approvalId, dto); }
  @Post(':id/records') record(@Param('id') id: string, @Body() dto: CreateDecisionRecordDto) { return this.rooms.createRecord(id, dto); }
  @Get(':id/history') history(@Param('id') id: string) { return this.rooms.history(id); }
}