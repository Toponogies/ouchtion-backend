import { createClient } from 'redis';

export const redisClient = createClient(process.env.REDIS_URL);
redisClient.on('connect',()=>{
console.log('Redis client connected')
});
redisClient.on('error', (error)=>{
console.log('Redis not connected', error)
});