import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDeviceTrustPolicyDto, DeviceApprovalDecisionDto, GrantDevicePermissionDto, RegisterDeviceDto, TrustDeviceDto } from '../dto/omnichannel.dto';
import { DevicesService } from './devices.service';

@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'devices', version: '1' })
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get() devices(@Query('deviceType') deviceType?: string, @Query('status') status?: string) { return this.devicesService.devices(deviceType, status); }
  @Post('register') register(@Body() dto: RegisterDeviceDto) { return this.devicesService.register(dto); }
  @Get('sessions') sessions(@Query('deviceId') deviceId?: string) { return this.devicesService.sessions(deviceId); }
  @Post(':id/trust') trust(@Param('id') id: string, @Body() dto: TrustDeviceDto) { return this.devicesService.trustDevice(id, dto); }
  @Post(':id/revoke') revoke(@Param('id') id: string, @Body('reason') reason?: string) { return this.devicesService.revokeDevice(id, reason); }
  @Post(':id/revoke-sessions') revokeSessions(@Param('id') id: string) { return this.devicesService.revokeSessions(id); }
  @Post(':id/permissions') grantPermission(@Param('id') id: string, @Body() dto: GrantDevicePermissionDto) { return this.devicesService.grantPermission(id, dto); }
  @Get(':id/activity') activity(@Param('id') id: string) { return this.devicesService.activity(id); }
  @Get('approvals') approvals(@Query('status') status?: string) { return this.devicesService.approvals(status); }
  @Post('approvals/:id/decision') decideApproval(@Param('id') id: string, @Body() dto: DeviceApprovalDecisionDto) { return this.devicesService.decideApproval(id, dto); }
  @Get('policies/trust') policies() { return this.devicesService.policies(); }
  @Post('policies/trust') createPolicy(@Body() dto: CreateDeviceTrustPolicyDto) { return this.devicesService.createPolicy(dto); }
}