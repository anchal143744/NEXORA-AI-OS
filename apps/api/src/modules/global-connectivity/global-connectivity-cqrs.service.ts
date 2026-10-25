import { Injectable } from '@nestjs/common';
import { CreateConnectivityRecordDto } from './dto/global-connectivity.dto';
import { ConnectivityEntity } from './global-connectivity.entities';
import { GlobalConnectivityCommandService } from './global-connectivity-command.service';
import { GlobalConnectivityQueryService } from './global-connectivity-query.service';

@Injectable()
export class GlobalConnectivityCqrsService {
  constructor(private readonly commands: GlobalConnectivityCommandService, private readonly queries: GlobalConnectivityQueryService) {}
  executeCommand(entity: ConnectivityEntity, dto: CreateConnectivityRecordDto) { return this.commands.create(entity, dto); }
  executeQuery(entity: ConnectivityEntity, filters: Record<string, string | undefined>) { return this.queries.list(entity, filters); }
}
