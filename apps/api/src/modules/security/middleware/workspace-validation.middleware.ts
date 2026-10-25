import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class WorkspaceValidationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const workspaceId = req.headers['x-workspace-id'];
    if (workspaceId && typeof workspaceId !== 'string') {
      throw new Error('x-workspace-id must be a single workspace identifier');
    }
    next();
  }
}
