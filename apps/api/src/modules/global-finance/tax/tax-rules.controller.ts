import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalculateTaxDto, CreateTaxCategoryDto, CreateTaxRegionDto, CreateTaxRuleDto } from '../dto/global-finance.dto';
import { TaxEngineService } from './tax-engine.service';

@ApiTags('Tax Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tax-rules', version: '1' })
export class TaxRulesController {
  constructor(private readonly tax: TaxEngineService) {}

  @Get() listRules(@Query('countryCode') countryCode?: string, @Query('taxType') taxType?: string) { return this.tax.listRules(countryCode, taxType); }
  @Post() createRule(@Body() dto: CreateTaxRuleDto) { return this.tax.createRule(dto); }
  @Post('calculate') calculate(@Body() dto: CalculateTaxDto) { return this.tax.calculate(dto); }
  @Get('regions') listRegions(@Query('countryCode') countryCode?: string) { return this.tax.listRegions(countryCode); }
  @Post('regions') createRegion(@Body() dto: CreateTaxRegionDto) { return this.tax.createRegion(dto); }
  @Get('categories') listCategories() { return this.tax.listCategories(); }
  @Post('categories') createCategory(@Body() dto: CreateTaxCategoryDto) { return this.tax.createCategory(dto); }
}