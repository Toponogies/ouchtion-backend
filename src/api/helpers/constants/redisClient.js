import { createClient} from 'redis';
var redisClient = createClient(process.env.REDIS_URL);
redisClient.connect()
redisClient.on('connect', function() {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Redis client can not connected' + err);
});

export async function  setRedis(key,object){
    key = ""+key;
    await redisClient.set(key,JSON.stringify(object),redisClient.print); 
    return 
}

export async function setExRedis(key,second,object){
    key = ""+key;
    await redisClient.setEx(key,second,JSON.stringify(object)); 
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