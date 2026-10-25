import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IpTrackingService {
  fromRequest(request: Request) {
    const forwardedFor = request.headers['x-forwarded-for'];
    return Array.isArray(forwardedFor) ? forwardedFor[0] : String(forwardedFor ?? request.ip ?? '');
  }
}
