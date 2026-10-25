import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CustomerPortalService } from '../customer-portal.service';
import { CreateCustomerAccountDto } from '../dto/customer-portal.dto';
import { ExternalPortalService } from '../external-portal.service';

@ApiTags('Customer Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-portal', version: '1' })
export class CustomerPortalController {
  constructor(private readonly portal: CustomerPortalService, private readonly external: ExternalPortalService) {}
  @Get('dashboard') dashboard() { return this.external.customerPortal(); }
  @Get('accounts') accounts(@Query('status') status?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('accountType') accountType?: string) { return this.portal.accounts(status, lifecycleStage, accountType); }
  @Post('accounts') createAccount(@Body() dto: CreateCustomerAccountDto) { return this.portal.createAccount(dto); }
}
