import { createClient } from 'redis';

const redisClient = createClient(process.env.REDIS_PORT);

export { redisClient };
