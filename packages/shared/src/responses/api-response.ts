export type ApiResponse<T> =
  | { success: true; data: T; meta: { timestamp: string; requestId?: string } }
  | { success: false; error: { code: string; message: string; details?: unknown }; meta: { timestamp: string; requestId?: string } };
