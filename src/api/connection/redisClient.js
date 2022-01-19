import { createClient } from 'redis';

//const redisClient = createClient(process.env.REDIS_URL);
const redisClient = createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});
redisClient.connect();

redisClient.on('connect', function () {
	console.log('Connected to Redis client successfully');
});

redisClient.on('error', function (err) {
	console.log('Failed to connect to Redis client: ' + err);
});

export default redisClient;

export async function setRedis(key, object) {
	key = '' + key;
	await redisClient.set(key, JSON.stringify(object), redisClient.print);
	return;
}

export async function setExRedis(key, second, object) {
	key = '' + key;
	await redisClient.setEx(key, second, JSON.stringify(object));
	return;
}

export async function getRedis(key) {
	key = '' + key;
	var value = await redisClient.get(key);
	return JSON.parse(value);
}

export async function delRedis(key) {
	key = '' + key;
	//var value =
	await redisClient.del(key);
	return;
}
