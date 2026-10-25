import { Injectable } from '@nestjs/common';
import { CreateProductionReadinessRecordDto } from './dto/production-readiness.dto';
import { ProductionReadinessCommandService } from './production-readiness-command.service';
import { ProductionReadinessEntity } from './production-readiness.entities';
import { ProductionReadinessQueryService } from './production-readiness-query.service';

@Injectable()
export class ProductionReadinessCqrsService {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService) {}
  executeCommand(entity: ProductionReadinessEntity, dto: CreateProductionReadinessRecordDto) { return this.commands.create(entity, dto); }
  executeQuery(entity: ProductionReadinessEntity, filters: Record<string, string | undefined>) { return this.queries.list(entity, filters); }
}
