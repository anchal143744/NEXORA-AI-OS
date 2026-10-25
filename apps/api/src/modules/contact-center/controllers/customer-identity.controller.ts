import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCustomerIdentityDto, ResolveCustomerIdentityDto } from '../dto/contact-center.dto';
import { OmnichannelEngagementService } from '../omnichannel-engagement.service';

@ApiTags('Customer Identity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-identity', version: '1' })
export class CustomerIdentityController {
  constructor(private readonly omnichannel: OmnichannelEngagementService) {}

  @Get() identities(@Query('query') query?: string) { return this.omnichannel.identities(query); }
  @Post() createIdentity(@Body() dto: CreateCustomerIdentityDto) { return this.omnichannel.createIdentity(dto); }
  @Get(':id') identity(@Param('id') id: string) { return this.omnichannel.getIdentity(id); }
  @Get(':id/timeline') timeline(@Param('id') id: string) { return this.omnichannel.identityTimeline(id); }
  @Post('resolve') resolve(@Body() dto: ResolveCustomerIdentityDto) { return this.omnichannel.resolveIdentity(dto); }
}
