import { Controller, Get, Res, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@ApiExcludeController()
@Controller('metrics')
export class PrometheusMetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @Version(VERSION_NEUTRAL)
  prometheus(@Res() response: Response) {
    response.setHeader('content-type', 'text/plain; version=0.0.4; charset=utf-8');
    response.send(this.metrics.prometheus());
  }
}