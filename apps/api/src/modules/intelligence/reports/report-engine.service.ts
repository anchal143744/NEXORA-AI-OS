import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { ReportFormat, ReportType } from './report.contracts';
import { ReportExporter } from './report-exporter.service';
import { ReportGenerator } from './report-generator.service';
@Injectable()
export class ReportEngine { constructor(private readonly context: TenantContextService, private readonly generator: ReportGenerator, private readonly exporter: ReportExporter, private readonly prisma: PrismaService, private readonly events: EventBusService) {} async generate(type: ReportType, format: ReportFormat) { const tenantId = this.context.currentTenantId(); const workspaceId = this.context.currentWorkspaceId(); const payload = await this.generator.generate(type); const exported = this.exporter.export(format, payload); const report = await this.prisma.reportRun.create({ data: { tenantId, workspaceId, reportType: type, format, status: 'SUCCEEDED', payload, output: exported } }); await this.events.publish({ tenantId, workspaceId, type: 'report.generated', source: 'report-engine', subject: { type: 'reportRun', id: report.id }, payload: { reportType: type, format } }); return report; } }
