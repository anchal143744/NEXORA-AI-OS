import { Injectable } from '@nestjs/common';
import { CreatePlanningRecordDto } from './dto/planning.dto';
import { PlanningCommandService } from './planning-command.service';
import { PlanningEntity } from './planning.entities';
import { PlanningQueryService } from './planning-query.service';

@Injectable()
export class PlanningCqrsService {
  constructor(private readonly commands: PlanningCommandService, private readonly queries: PlanningQueryService) {}
  executeCommand(entity: PlanningEntity, dto: CreatePlanningRecordDto) { return this.commands.create(entity, dto); }
  executeQuery(entity: PlanningEntity, filters: Record<string, string | undefined>) { return this.queries.list(entity, filters); }
}
