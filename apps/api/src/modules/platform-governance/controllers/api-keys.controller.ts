import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiKeyGovernanceService } from '../api-key-governance.service';
import { CreateGovernedApiKeyDto } from '../dto/platform-governance.dto';

@ApiTags('Governed API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-keys', version: '1' })
export class ApiKeysController {
  constructor(private readonly keys: ApiKeyGovernanceService) {}

  @Get() list() { return this.keys.list(); }
  @Post() create(@Body() dto: CreateGovernedApiKeyDto) { return this.keys.create(dto); }
  @Post(':id/rotate') rotate(@Param('id') id: string) { return this.keys.rotate(id); }
  @Post(':id/revoke') revoke(@Param('id') id: string) { return this.keys.revoke(id); }
}
