import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ModuleActivationService } from './module-activation.service';
import { ModuleMetadataService } from './module-metadata.service';
import { ModuleRegistryController } from './module-registry.controller';
import { ModuleRegistryService } from './module-registry.service';

@Module({
  imports: [TenantsModule, AuditModule],
  controllers: [ModuleRegistryController],
  providers: [ModuleMetadataService, ModuleActivationService, ModuleRegistryService],
  exports: [ModuleMetadataService, ModuleActivationService, ModuleRegistryService],
})
export class ModuleRegistryModule {}
