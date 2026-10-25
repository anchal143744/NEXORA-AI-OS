import { Injectable } from '@nestjs/common';
import { DependencyValidationService } from './dependency-validation.service';
import { EnvironmentValidationService } from './environment-validation.service';
@Injectable()
export class StartupValidationService { constructor(private readonly env: EnvironmentValidationService, private readonly deps: DependencyValidationService) {} async validate() { return { environment: this.env.validate(), dependencies: await this.deps.validate(), checkedAt: new Date().toISOString() }; } }
