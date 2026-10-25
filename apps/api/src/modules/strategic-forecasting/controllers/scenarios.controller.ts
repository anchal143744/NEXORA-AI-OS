import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateScenarioModelDto, GenerateScenarioResultDto } from '../dto/strategic-forecasting.dto';
import { ScenarioModelingService } from '../scenario-modeling.service';

@ApiTags('Scenario Modeling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scenarios', version: '1' })
export class ScenariosController {
  constructor(private readonly scenarios: ScenarioModelingService) {}

  @Get() list(@Query('status') status?: string, @Query('scenarioType') scenarioType?: string) { return this.scenarios.scenarios(status, scenarioType); }
  @Post() create(@Body() dto: CreateScenarioModelDto) { return this.scenarios.createScenario(dto); }
  @Get('results') results(@Query('scenarioModelId') scenarioModelId?: string) { return this.scenarios.results(scenarioModelId); }
  @Post('results') generateResult(@Body() dto: GenerateScenarioResultDto) { return this.scenarios.generateResult(dto); }
  @Get('what-if') whatIf() { return this.scenarios.whatIf(); }
  @Get('studio') studio() { return this.scenarios.studio(); }
}