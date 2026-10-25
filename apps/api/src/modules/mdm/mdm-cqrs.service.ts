import { Injectable } from '@nestjs/common';
import { CreateMdmRecordDto } from './dto/mdm.dto';
import { MdmCommandService } from './mdm-command.service';
import { MdmEntity } from './mdm.entities';
import { MdmQueryService } from './mdm-query.service';

@Injectable()
export class MdmCqrsService {
  constructor(private readonly commands: MdmCommandService, private readonly queries: MdmQueryService) {}
  executeCommand(entity: MdmEntity, dto: CreateMdmRecordDto) { return this.commands.create(entity, dto); }
  executeQuery(entity: MdmEntity, filters: Record<string, string | undefined>) { return this.queries.list(entity, filters); }
}
