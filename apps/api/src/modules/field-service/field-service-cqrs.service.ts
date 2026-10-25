import { Injectable } from '@nestjs/common';
import { FieldServiceCommandService } from './field-service-command.service';
import { FIELD_SERVICE_ENTITIES } from './field-service.entities';
import { FieldServiceQueryService } from './field-service-query.service';

@Injectable()
export class FieldServiceCqrsService {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService) {}
  commandHandlers() { return FIELD_SERVICE_ENTITIES.map((entity) => 'create:' + entity.entity); }
  queryHandlers() { return FIELD_SERVICE_ENTITIES.map((entity) => 'list:' + entity.entity); }
  get commandBus() { return this.commands; }
  get queryBus() { return this.queries; }
}

