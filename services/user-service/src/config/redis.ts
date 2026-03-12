import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis({
  host: env.redisHost,
  port: env.redisPort,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on('error', (error: Error) => {
  console.error('User service Redis error:', error.message);
});
