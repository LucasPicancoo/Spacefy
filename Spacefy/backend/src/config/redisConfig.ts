import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

//if (!redisUrl) {
//  throw new Error('REDIS_URL não definida no .env');
//}

const redisClient = new Redis(redisUrl!);

async function getRedis(value: string) {
  return await redisClient.get(value);
}

async function setRedis(key: string, value: string, expiryTime?: number) {
  if (expiryTime) {
    return await redisClient.setex(key, expiryTime, value);
  }
  return await redisClient.set(key, value);
}

async function deleteRedis(key: string) {
  return await redisClient.del(key);
}

async function deleteRedisPattern(pattern: string) {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    return await redisClient.del(...keys);
  }
  return 0;
}

export default { redisClient, getRedis, setRedis, deleteRedis, deleteRedisPattern };