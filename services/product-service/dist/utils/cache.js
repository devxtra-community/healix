import { redis } from '../config/redis.js';
let isConnecting = false;
async function ensureRedisConnection() {
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
export async function getCache(key) {
  const isReady = await ensureRedisConnection();
  if (!isReady) {
    return null;
  }
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
export async function setCache(key, value, ttlSeconds) {
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
export async function deleteCache(key) {
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
