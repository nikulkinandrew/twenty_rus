import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

import { CacheStorageType } from 'src/engine/core-modules/cache-storage/types/cache-storage-type.enum';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';

export const getSessionStorageOptions = (
  environmentService: EnvironmentService,
): session.SessionOptions => {
  const cacheStorageType = CacheStorageType.Redis;

  const SERVER_URL = environmentService.get('SERVER_URL');

  const sessionStorage: session.SessionOptions = {
    secret: environmentService.get('SESSION_STORE_SECRET'),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: !!(SERVER_URL && SERVER_URL.startsWith('https')),
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  };

  switch (cacheStorageType) {
    /* case CacheStorageType.Memory: {
      Logger.warn(
        'Memory session storage is not recommended for production. Prefer Redis.',
      );

      return sessionStorage;
    }*/
    case CacheStorageType.Redis: {
      const connectionString = environmentService.get('REDIS_URL');

      if (!connectionString) {
        throw new Error(
          `${CacheStorageType.Redis} session storage requires REDIS_URL to be defined, check your .env file`,
        );
      }

      const redisClient = createClient({
        url: connectionString,
      });

      redisClient.connect().catch((err) => {
        throw new Error(`Redis connection failed: ${err}`);
      });

      return {
        ...sessionStorage,
        store: new RedisStore({
          client: redisClient,
          prefix: 'engine:session:',
        }),
      };
    }
    default:
      throw new Error(
        `Invalid session-storage (${cacheStorageType}), check your .env file`,
      );
  }
};
