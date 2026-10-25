import { Global, Module } from '@nestjs/common';
import { CommonModule } from '../../../common/common.module';
import { LoggingService } from './logging.service';
import { MetricsService } from './metrics.service';
import { TracingService } from './tracing.service';

@Global()
@Module({ imports: [CommonModule], providers: [LoggingService, MetricsService, TracingService], exports: [LoggingService, MetricsService, TracingService] })
export class ObservabilityModule {}