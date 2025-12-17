import Redis, { RedisOptions } from 'ioredis';
import { logger } from './logger';

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
  enableReadyCheck: true,
  lazyConnect: true,
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error:', err));

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, data);
    } else {
      await redis.set(key, data);
    }
  },
  async del(key: string): Promise<void> {
    await redis.del(key);
  },
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  },
};
