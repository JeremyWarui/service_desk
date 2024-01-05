/*import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: '127.0.0.1',
      port: 6379,
    });
    this.isConnected = true;
    this.getClient = promisify(this.client.get).bind(this.client);
    this.client.on('error', (err) => {
      this.isConnected = false;
      console.error(err);
    });
    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, val, duration) {
    return promisify(this.client.SETEX).bind(this.client)(key, duration, val);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
*/