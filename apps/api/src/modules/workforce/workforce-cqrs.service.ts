import { Injectable } from '@nestjs/common';
import { WorkforceCommandService } from './workforce-command.service';
import { WORKFORCE_ENTITIES } from './workforce.entities';
import { WorkforceQueryService } from './workforce-query.service';

@Injectable()
export class WorkforceCqrsService {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService) {}

  commandHandlers() {
    return WORKFORCE_ENTITIES.map((entity) => 'create:' + entity.entity);
  }

  queryHandlers() {
    return WORKFORCE_ENTITIES.map((entity) => 'list:' + entity.entity);
  }

  get commandBus() { return this.commands; }
  get queryBus() { return this.queries; }
}

