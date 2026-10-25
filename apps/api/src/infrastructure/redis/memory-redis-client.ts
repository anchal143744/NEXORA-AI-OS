type StoredValue = { value: string; expiresAt?: number };
type MessageHandler = (channel: string, message: string) => void;

export class MemoryRedisClient {
  status = 'ready';
  private readonly values = new Map<string, StoredValue>();
  private readonly handlers = new Set<MessageHandler>();
  private readonly subscriptions = new Set<string>();

  async connect() {
    this.status = 'ready';
  }

  async quit() {
    this.status = 'end';
  }

  disconnect() {
    this.status = 'end';
  }

  async ping() {
    return 'PONG';
  }

  async get(key: string) {
    const stored = this.values.get(key);
    if (!stored) return null;
    if (stored.expiresAt && stored.expiresAt <= Date.now()) {
      this.values.delete(key);
      return null;
    }
    return stored.value;
  }

  async set(key: string, value: string, mode?: string, ttlSeconds?: number) {
    const expiresAt = mode === 'EX' && typeof ttlSeconds === 'number' ? Date.now() + ttlSeconds * 1000 : undefined;
    this.values.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string) {
    return this.values.delete(key) ? 1 : 0;
  }

  async publish(channel: string, message: string) {
    for (const handler of this.handlers) {
      if (this.subscriptions.has(channel)) handler(channel, message);
    }
    return this.handlers.size;
  }

  async subscribe(channel: string) {
    this.subscriptions.add(channel);
    return this.subscriptions.size;
  }

  on(event: 'message', handler: MessageHandler) {
    if (event === 'message') this.handlers.add(handler);
    return this;
  }
}