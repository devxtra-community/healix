import { redis } from '../config/redis.js';

let isConnecting = false;

async function ensureRedisConnection(): Promise<boolean> {
  if (redis.status === 'ready' || redis.status === 'connect') {
    return true;
  }

  if (isConnecting) {
    return false;
  }

  try {
    isConnecting = true;
    await redis.connect();
    return true;
  } catch {
    return false;
  } finally {
    isConnecting = false;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const isReady = await ensureRedisConnection();

  if (!isReady) {
    return null;
  }

  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  const isReady = await ensureRedisConnection();

  if (!isReady) {
    return;
  }

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    return;
  }
}

export async function deleteCache(key: string): Promise<void> {
  const isReady = await ensureRedisConnection();

  if (!isReady) {
    return;
  }

  try {
    await redis.del(key);
  } catch {
    return;
  }
}
