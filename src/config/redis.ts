import { createClient } from 'redis';

class RedisConfig {
    private client;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_HOST || 'redis://localhost:6379',
        })

        this.client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        this.client.connect().catch(console.error);
    }

    getClient = () => {
        return this.client;
    }
}

export const redisConfig = new RedisConfig();