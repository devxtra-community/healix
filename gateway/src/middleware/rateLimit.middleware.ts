import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.ts';
import { Command } from 'ioredis';
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (Command: string, ...args: string[]) =>
      redis.call(Command, ...args) as Promise<any>,
  }),
});
