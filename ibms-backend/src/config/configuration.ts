import { validateEnv } from './env.validation.js';

export default () => {
  const env = validateEnv();

  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    logLevel: env.LOG_LEVEL,

    database: {
      url: env.DATABASE_URL,
    },

    jwt: {
      accessPrivateKeyPath: env.JWT_ACCESS_PRIVATE_KEY_PATH,
      accessPublicKeyPath: env.JWT_ACCESS_PUBLIC_KEY_PATH,
      refreshSecret: env.JWT_REFRESH_SECRET,
      accessExpiry: env.JWT_ACCESS_EXPIRY,
      refreshExpiry: env.JWT_REFRESH_EXPIRY,
    },

    cors: {
      origins: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    },

    frontendUrl: env.FRONTEND_URL,

    throttle: {
      ttl: env.THROTTLE_TTL * 1000, // convert to milliseconds
      limit: env.THROTTLE_LIMIT,
    },

    swagger: {
      enabled: env.SWAGGER_ENABLED,
    },

    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
  };
};
