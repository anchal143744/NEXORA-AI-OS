import { Injectable } from '@nestjs/common';
import { TenantContextService } from '../../tenants/tenant-context.service';

export type SearchRecord = {
  id: string;
  tenantId: string;
  workspaceId?: string | null;
  title?: string | null;
  summary?: string | null;
  searchableText?: string | null;
  sensitivityLevel?: string | null;
  classification?: string | null;
  permissions?: unknown;
  moduleKey?: string | null;
  metadata?: unknown;
};

export type SecureSearchOptions = {
  workspaceId?: string;
  roleKeys?: string[];
  permissionKeys?: string[];
  includeSensitive?: boolean;
  maxSensitivity?: string;
};

@Injectable()
export class SecureSearchService {
  constructor(private readonly context: TenantContextService) {}

  tenantScopedWhere(workspaceId?: string) {
    return { tenantId: this.context.currentTenantId(), workspaceId: workspaceId ?? this.context.currentWorkspaceId() ?? undefined, deletedAt: null };
  }

  filterDocuments<T extends SearchRecord>(records: T[], options: SecureSearchOptions = {}) {
    const threshold = options.maxSensitivity ?? (options.includeSensitive ? 'restricted' : 'confidential');
    const permitted: T[] = [];
    let filteredCount = 0;

    for (const record of records) {
      if (this.canAccess(record, threshold, options)) {
        permitted.push(this.maskRecord(record, options));
      } else {
        filteredCount += 1;
      }
    }

    return { records: permitted, filteredCount };
  }

  buildAccessContext(options: SecureSearchOptions = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: options.workspaceId ?? this.context.currentWorkspaceId(),
      userId: this.context.context()?.userId,
      roles: options.roleKeys ?? [],
      permissions: options.permissionKeys ?? [],
      sensitivityThreshold: options.maxSensitivity ?? (options.includeSensitive ? 'restricted' : 'confidential'),
    };
  }

  private canAccess(record: SearchRecord, threshold: string, options: SecureSearchOptions) {
    if (record.tenantId !== this.context.currentTenantId()) return false;
    const currentWorkspace = options.workspaceId ?? this.context.currentWorkspaceId();
    if (currentWorkspace && record.workspaceId && record.workspaceId !== currentWorkspace) return false;
    return this.sensitivityRank(record.sensitivityLevel) <= this.sensitivityRank(threshold);
  }

  private maskRecord<T extends SearchRecord>(record: T, options: SecureSearchOptions) {
    if (options.includeSensitive) return record;
    const sensitivity = this.sensitivityRank(record.sensitivityLevel);
    if (sensitivity < this.sensitivityRank('confidential')) return record;
    return { ...record, searchableText: undefined, summary: record.summary ? this.maskText(record.summary) : record.summary, metadata: this.maskMetadata(record.metadata) } as T;
  }

  private sensitivityRank(value?: string | null) {
    const normalized = (value ?? 'internal').toLowerCase();
    const ranks: Record<string, number> = { public: 0, internal: 1, medium: 1, confidential: 2, sensitive: 2, high: 2, restricted: 3, critical: 3 };
    return ranks[normalized] ?? 1;
  }

  private maskText(value: string) {
    if (value.length <= 48) return '[restricted summary]';
    return `${value.slice(0, 48)}... [restricted]`;
  }

  private maskMetadata(metadata: unknown) {
    if (!metadata || typeof metadata !== 'object') return metadata;
    return { classification: 'masked', reason: 'secure_search_policy' };
  }
}