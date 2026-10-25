import { Injectable } from '@nestjs/common';
@Injectable()
export class StorageAbstractionService {
  buildPendingStorageKey(tenantId: string, workspaceId: string, fileName: string) {
    return `pending/${tenantId}/${workspaceId}/${Date.now()}-${fileName}`;
  }
}
