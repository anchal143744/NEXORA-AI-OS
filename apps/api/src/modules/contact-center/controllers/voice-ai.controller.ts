import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddVoiceTranscriptDto, CreateVoiceSessionDto, VoiceActionDto, VoiceCommandDto } from '../dto/contact-center.dto';
import { VoiceAiService } from '../voice-ai.service';

@ApiTags('Voice AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'voice-ai', version: '1' })
export class VoiceAiController {
  constructor(private readonly voice: VoiceAiService) {}

  @Get('sessions') sessions(@Query('status') status?: string) { return this.voice.sessions(status); }
  @Post('sessions') createSession(@Body() dto: CreateVoiceSessionDto) { return this.voice.createSession(dto); }
  @Get('sessions/:id') session(@Param('id') id: string) { return this.voice.getSession(id); }
  @Post('sessions/:id/end') endSession(@Param('id') id: string) { return this.voice.endSession(id); }
  @Get('sessions/:id/transcripts') transcripts(@Param('id') id: string) { return this.voice.transcripts(id); }
  @Post('sessions/:id/transcripts') addTranscript(@Param('id') id: string, @Body() dto: AddVoiceTranscriptDto) { return this.voice.addTranscript(id, dto); }
  @Get('speech-to-text/providers') speechToText() { return this.voice.speechToTextProviders(); }
  @Get('text-to-speech/providers') textToSpeech() { return this.voice.textToSpeechProviders(); }
  @Post('commands/process') processCommand(@Body() dto: VoiceCommandDto) { return this.voice.processCommand(dto); }
  @Post('actions/execute') executeAction(@Body() dto: VoiceActionDto) { return this.voice.executeAction(dto); }
  @Get('history') history(@Query('customerIdentityId') customerIdentityId?: string, @Query('conversationId') conversationId?: string) { return this.voice.history(customerIdentityId, conversationId); }
}
