import { createClient } from 'redis';

const redisClient = createClient(process.env.REDIS_PORT);

const clientConnect = async () => {
  await redisClient.connect();
};

const set = (key, value) => {
  redisClient.set(key, JSON.stringify(value));
};

const get = (req, res, next) => {
  let key = req.originalUrl;

  redisClient.get(key, (error, data) => {
    if (error) {
      res.status(400).send({
        ok: false,
        message: error,
      });
    }
    if (data !== null) {
      console.log('data from redis!');
      res.status(200).send({
        ok: true,
        data: JSON.parse(data),
      });
    } else next();
  });
};

export { redisClient, clientConnect };
