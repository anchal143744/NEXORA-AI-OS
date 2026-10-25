import { Injectable } from '@nestjs/common';
import { ReportFormat } from './report.contracts';
@Injectable()
export class ReportExporter { export(format: ReportFormat, payload: Record<string, unknown>) { if (format === 'json') return { contentType: 'application/json', body: payload }; if (format === 'csv') return { contentType: 'text/csv', body: Object.entries(payload).map(([k,v]) => `${k},${JSON.stringify(v)}`).join('\n') }; if (format === 'excel') return { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', body: payload }; return { contentType: 'application/pdf', body: payload }; } }
