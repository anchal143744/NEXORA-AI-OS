import { ShopBusinessSetupDto } from './shop.dto';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShopCustomerDto, ShopCustomerUpdateDto, ShopExpenseDto, ShopFollowUpDto, ShopFollowUpUpdateDto, ShopProductDto, ShopProductUpdateDto, ShopQueryDto, ShopSettingsDto } from './shop.dto';
import { ShopService } from './shop.service';
import { RetailSalesService } from './retail-sales.service';
import { ShopCustomerQueryDto } from './shop.dto';
import { ShopPreferencesDto } from './shop.dto';
import {ShopDocumentsService} from './shop-documents.service';
import {InvoiceSourceDto,SignatureDto} from './shop-documents.dto';
import {Throttle} from '@nestjs/throttler';
import {ShopLeadsService} from './shop-leads.service';import {LeadImportDto} from './shop-leads.dto';
import {ShopAssistantService} from './shop-assistant.service';import {FollowUpDraftDto} from './shop.dto';

@ApiTags('Retail workspace') @ApiBearerAuth() @UseGuards(JwtAuthGuard)
@Controller({ path: 'retail/shop', version: '1' })
export class ShopController {
  constructor(private readonly shop: ShopService, private readonly sales: RetailSalesService,private readonly documents:ShopDocumentsService,private readonly assistant:ShopAssistantService,private readonly leads:ShopLeadsService) {}
  @Post('lead-import') importLeads(@Body() dto:LeadImportDto){return this.leads.import(dto);}
  @Post('lead-connection') leadConnection(){return this.leads.connection();}
  @Post('follow-up-draft') @Throttle({default:{limit:5,ttl:60000}}) draft(@Body() dto:FollowUpDraftDto){return this.assistant.draft(dto.customerId,dto.goal,dto.language);}
  @Get('documents') invoiceSources(){return this.documents.sources();}
  @Post('documents') @Throttle({default:{limit:5,ttl:60000}}) uploadInvoiceSource(@Body() dto:InvoiceSourceDto){return this.documents.upload(dto);}
  @Get('documents/:id') source(@Param('id',ParseUUIDPipe) id:string){return this.documents.source(id);}
  @Post('signature') registerSignature(@Body() dto:SignatureDto){return this.documents.signature(dto);}
  @Get('sales/:id/invoice') invoice(@Param('id',ParseUUIDPipe) id:string){return this.documents.invoice(id);}
  @Get('sales') listSales(@Query() query: ShopQueryDto) { return this.sales.page(query); }
  @Get('settings') settings() { return this.shop.settings(); }
  @Get('overview') overview() { return this.shop.overview(); }
  @Post('setup') setup(@Body() dto: ShopBusinessSetupDto) { return this.shop.completeSetup(dto); }
  @Patch('settings') configure(@Body() dto: ShopSettingsDto) { return this.shop.configure(dto); }
  @Patch('preferences') preferences(@Body() dto: ShopPreferencesDto) { return this.shop.savePreferences(dto); }
  @Get('customers') customers(@Query() query: ShopCustomerQueryDto) { return this.shop.customers(query); }
  @Post('customers') createCustomer(@Body() dto: ShopCustomerDto) { return this.shop.createCustomer(dto); }
  @Patch('customers/:id') updateCustomer(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ShopCustomerUpdateDto) { return this.shop.updateCustomer(id, dto); }
  @Get('follow-ups') followUps(@Query() query: ShopQueryDto) { return this.shop.followUps(query); }
  @Post('follow-ups') createFollowUp(@Body() dto: ShopFollowUpDto) { return this.shop.createFollowUp(dto); }
  @Patch('follow-ups/:id') updateFollowUp(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ShopFollowUpUpdateDto) { return this.shop.updateFollowUp(id, dto.status); }
  @Get('products') products(@Query() query: ShopQueryDto) { return this.shop.products(query); }
  @Post('products') createProduct(@Body() dto: ShopProductDto) { return this.shop.createProduct(dto); }
  @Patch('products/:id') updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ShopProductUpdateDto) { return this.shop.updateProduct(id, dto); }
  @Get('products/:id/movements') movements(@Param('id', ParseUUIDPipe) id: string, @Query() query: ShopQueryDto) { return this.shop.movements(id, query); }
  @Get('expenses') expenses(@Query() query: ShopQueryDto) { return this.shop.expenses(query); }
  @Post('expenses') createExpense(@Body() dto: ShopExpenseDto) { return this.shop.createExpense(dto); }
}
