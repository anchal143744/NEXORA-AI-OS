import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateImportJobDto, CsvImportDto, ExcelImportDto } from '../dto/onboarding.dto';

type ImportRow = Record<string, unknown>;
interface ValidationIssue { rowNumber?: number; field?: string; code: string; message: string; severity?: string; sourceData?: ImportRow; }

@Injectable()
export class DataImportService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  jobs(status?: string) { return this.prisma.dataImportJob.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, include: { errors: true, batches: true }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  async createJob(dto: CreateImportJobDto) {
    const tenantId = this.context.currentTenantId();
    const job = await this.prisma.dataImportJob.create({ data: { tenantId, workspaceId: this.context.currentWorkspaceId(), importType: 'manual', sourceFormat: dto.sourceFormat, targetEntity: dto.targetEntity, fileName: dto.fileName, createdByUserId: this.context.context()?.userId, mapping: dto.mapping ?? {}, validationRules: dto.validationRules ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId: job.workspaceId ?? undefined, type: 'data_import.created', source: 'data-import-engine', subject: { type: 'data_import_job', id: job.id }, payload: { targetEntity: job.targetEntity, sourceFormat: job.sourceFormat }, actorUserId: this.context.context()?.userId });
    return job;
  }

  async importCsv(dto: CsvImportDto) {
    const rows = this.parseCsv(dto.csvText);
    return this.createImportWithRows({ ...dto, sourceFormat: 'csv' }, rows, dto.csvText);
  }

  async importExcel(dto: ExcelImportDto) {
    const sheet = dto.workbook.sheets.find((candidate) => candidate.name === dto.sheetName) ?? dto.workbook.sheets[0];
    const rows = sheet?.rows ?? [];
    return this.createImportWithRows({ ...dto, sourceFormat: 'excel', metadata: { ...(dto.metadata ?? {}), sheetName: sheet?.name } }, rows, JSON.stringify(dto.workbook));
  }

  async processJob(id: string) {
    const tenantId = this.context.currentTenantId();
    const job = await this.prisma.dataImportJob.findFirst({ where: { tenantId, id, deletedAt: null }, include: { records: true } });
    if (!job) throw new NotFoundException('Import job not found');
    const validRecords = job.records.filter((record: any) => record.status === 'valid');
    await Promise.all(validRecords.map((record: any) => this.prisma.dataImportRecord.update({ where: { id: record.id }, data: { status: 'processed', processedAt: new Date(), targetId: `${job.targetEntity}-${record.rowNumber}` } })));
    const completed = await this.prisma.dataImportJob.update({ where: { id }, data: { status: job.errorRows > 0 ? 'completed_with_errors' : 'completed', completedAt: new Date(), validRows: validRecords.length } });
    await this.events.publish({ tenantId, workspaceId: job.workspaceId ?? undefined, type: 'data_import.processed', source: 'data-import-engine', subject: { type: 'data_import_job', id }, payload: { targetEntity: job.targetEntity, totalRows: job.totalRows, validRows: validRecords.length, errorRows: job.errorRows }, actorUserId: this.context.context()?.userId });
    return completed;
  }

  errors(jobId: string) { return this.prisma.dataImportError.findMany({ where: { tenantId: this.context.currentTenantId(), importJobId: jobId, deletedAt: null }, orderBy: { createdAt: 'asc' } }); }
  records(jobId: string) { return this.prisma.dataImportRecord.findMany({ where: { tenantId: this.context.currentTenantId(), importJobId: jobId, deletedAt: null }, orderBy: { rowNumber: 'asc' }, take: 1000 }); }

  private async createImportWithRows(dto: CreateImportJobDto, rows: ImportRow[], rawContent: string) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const mapping = dto.mapping ?? {};
    const normalizedRows = rows.map((row) => this.normalize(row, mapping));
    const issues = normalizedRows.flatMap((row, index) => this.validate(row, index + 1, dto.validationRules ?? {}));
    const issueRows = new Set(issues.map((issue) => issue.rowNumber).filter(Boolean));
    const job = await this.prisma.dataImportJob.create({ data: { tenantId, workspaceId, importType: 'manual', sourceFormat: dto.sourceFormat, targetEntity: dto.targetEntity, fileName: dto.fileName, fileHash: createHash('sha256').update(rawContent).digest('hex'), totalRows: rows.length, validRows: rows.length - issueRows.size, errorRows: issueRows.size, status: issues.length ? 'validated_with_errors' : 'validated', createdByUserId: this.context.context()?.userId, mapping, validationRules: dto.validationRules ?? {}, metadata: dto.metadata ?? {}, batches: { create: this.toBatches(tenantId, workspaceId, rows.length) }, records: { create: normalizedRows.map((row, index) => ({ tenantId, workspaceId, rowNumber: index + 1, status: issueRows.has(index + 1) ? 'invalid' : 'valid', sourceData: rows[index], normalizedData: row, targetEntity: dto.targetEntity })) }, errors: { create: issues.map((issue) => ({ tenantId, workspaceId, rowNumber: issue.rowNumber, field: issue.field, code: issue.code, message: issue.message, severity: issue.severity ?? 'error', sourceData: issue.sourceData ?? {} })) } }, include: { batches: true, records: true, errors: true } });
    await this.events.publish({ tenantId, workspaceId, type: 'data_import.created', source: 'data-import-engine', subject: { type: 'data_import_job', id: job.id }, payload: { targetEntity: dto.targetEntity, sourceFormat: dto.sourceFormat, totalRows: rows.length, errorRows: issueRows.size }, actorUserId: this.context.context()?.userId });
    return job;
  }

  private parseCsv(csvText: string): ImportRow[] {
    const lines = csvText.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim().length);
    if (lines.length < 2) return [];
    const headers = this.parseCsvLine(lines[0]).map((header) => header.trim());
    return lines.slice(1).map((line) => { const values = this.parseCsvLine(line); return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])); });
  }

  private parseCsvLine(line: string) {
    const values: string[] = [];
    let value = '';
    let quoted = false;
    for (let index = 0; index < line.length; index++) {
      const char = line[index];
      const next = line[index + 1];
      if (char === '"' && quoted && next === '"') { value += '"'; index++; continue; }
      if (char === '"') { quoted = !quoted; continue; }
      if (char === ',' && !quoted) { values.push(value); value = ''; continue; }
      value += char;
    }
    values.push(value);
    return values;
  }

  private normalize(row: ImportRow, mapping: Record<string, string>) {
    if (!Object.keys(mapping).length) return row;
    return Object.fromEntries(Object.entries(mapping).map(([source, target]) => [target, row[source]]));
  }

  private validate(row: ImportRow, rowNumber: number, rules: Record<string, unknown>): ValidationIssue[] {
    const required = Array.isArray(rules.required) ? rules.required.map(String) : [];
    return required.filter((field) => row[field] === undefined || row[field] === null || row[field] === '').map((field) => ({ rowNumber, field, code: 'required_field_missing', message: `${field} is required`, sourceData: row }));
  }

  private toBatches(tenantId: string, workspaceId: string | undefined, rowCount: number) {
    const size = 500;
    const batchCount = Math.max(1, Math.ceil(rowCount / size));
    return Array.from({ length: batchCount }).map((_, index) => ({ tenantId, workspaceId, batchNumber: index + 1, rowStart: index * size + 1, rowEnd: Math.min((index + 1) * size, rowCount), status: 'queued' }));
  }
}
