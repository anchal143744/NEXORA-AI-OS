import { Injectable } from '@nestjs/common';
import { StartupValidationService } from './startup-validation.service';

type DependencyCheck = {
  status?: string;
};

function dependencyReady(check: DependencyCheck) {
  if (check.status === 'ok') return true;
  return process.env.NODE_ENV !== 'production' && check.status === 'disabled';
}

@Injectable()
export class ReadinessCheckService {
  constructor(private readonly startup: StartupValidationService) {}

  async check() {
    const result = await this.startup.validate();
    const dependenciesReady = Object.values(result.dependencies).every(dependencyReady);
    return {
      ready: result.environment.valid && dependenciesReady,
      dependenciesReady,
      ...result,
    };
  }
}
