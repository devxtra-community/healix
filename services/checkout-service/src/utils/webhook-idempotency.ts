import { Redis } from 'ioredis';

export class webhookIdempotency {
  constructor(private redis: Redis) {}
  async isProcessed(eventId: string): Promise<boolean> {
    const key = `stripe:webhook:${eventId}`;
    const exists = await this.redis.exists(key);
    return exists === 1;
  }
  async markProcessed(eventId: string): Promise<void> {
    const key = `stripe:webhook:${eventId}`;
    await this.redis.set(key, 'processed', 'EX', 60 * 60 * 24);
  }
}
