import { Global, Module } from '@nestjs/common';
import { RequestContextStore } from './context/request-context.store';

@Global()
@Module({
  providers: [RequestContextStore],
  exports: [RequestContextStore],
})
export class CommonModule {}
