import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      const path = String(request.originalUrl ?? request.url ?? '');
      if (path.includes('/metrics')) return next.handle();
    }
    return next.handle().pipe(map((data) => ({ success: true, data, meta: { timestamp: new Date().toISOString() } })));
  }
}