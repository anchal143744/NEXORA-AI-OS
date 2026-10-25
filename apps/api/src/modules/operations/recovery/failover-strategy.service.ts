import { Injectable } from '@nestjs/common';
@Injectable()
export class FailoverStrategy { plan() { return { database: 'promote-read-replica', redis: 'switch-managed-primary', queues: 'pause-drain-resume', storage: 'switch-replica-bucket', targetRtoMinutes: 30, targetRpoMinutes: 15 }; } }
