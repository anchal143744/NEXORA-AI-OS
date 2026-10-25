import { Injectable } from '@nestjs/common';
import { ModuleActivationService } from './module-activation.service';
import { ModuleMetadataService } from './module-metadata.service';

@Injectable()
export class ModuleRegistryService {
  constructor(private readonly metadata: ModuleMetadataService, private readonly activation: ModuleActivationService) {}

  discover() {
    return this.metadata.discover();
  }

  metadataFor(moduleKey: string) {
    return this.metadata.find(moduleKey);
  }

  activations(businessId: string) {
    return this.activation.listForBusiness(businessId);
  }
}
