import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class DatabaseHealthService { constructor(private readonly prisma: PrismaService) {} async check() { const started = Date.now(); await this.prisma.tenant.count({ take: 1 } as any); return { status: 'ok', latencyMs: Date.now() - started }; } }
