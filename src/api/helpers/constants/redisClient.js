import { createClient } from 'redis';

const redisClient = createClient(process.env.REDIS_URL);
redisClient.connect()

export async function  setRedis(key,object){
    key = ""+key;
    await redisClient.set(key,JSON.stringify(object),redisClient.print); 
    return 
}

export async function  getRedis(key){
    key = ""+key;
    var value = await redisClient.get(key);
    return JSON.parse(value);
}

export async function  delRedis(key){
    key = ""+key;
    var value = await redisClient.del(key);
    return ;
}