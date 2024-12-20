import { Redis } from "ioredis";

const redisClient = new Redis({
    host : process.env.REDIS_HOST || '127.0.0.1',
    port : process.env.REDIS_PORT || 6379,
    password : process.env.REDIS_PASSWORD || null
})

redisClient.on('connect', ()=>console.log('Redis Connected'))
redisClient.on('error', (err)=>console.error('Redis error : ', err))

export default redisClient