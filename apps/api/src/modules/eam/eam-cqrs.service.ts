import { Injectable } from '@nestjs/common';
import { EamCommandService } from './eam-command.service';
import { EAM_ENTITIES } from './eam.entities';
import { EamQueryService } from './eam-query.service';

@Injectable()
export class EamCqrsService {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService) {}
  commandHandlers() { return EAM_ENTITIES.map((entity) => 'create:' + entity.entity); }
  queryHandlers() { return EAM_ENTITIES.map((entity) => 'list:' + entity.entity); }
  get commandBus() { return this.commands; }
  get queryBus() { return this.queries; }
}

