import redis from 'redis'

class redis_cache {
  public async createConnection() {
    const client = await redis.createClient(process.env.REDIS_URI!, {
        tls:{
            rejectUnauthorized: false
        }
    })

    client.on('connect', ()=>{
        console.log("Redis cache is connected");
    })

    client.on('ready', ()=>{
        console.log('Cache is connected and ready to use');
    })

    client.on('error', (err)=>{
        console.log(err.message);
    })

    client.on('end', ()=>{
        console.log("Redis cache got disconnected");
    })

    client.on('SIGINT', ()=>{
        client.quit()
    })
  }
}

const cache = new redis_cache();
export { cache as redis_cache };
