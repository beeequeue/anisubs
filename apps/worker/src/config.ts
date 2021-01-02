import { RedisOptions } from "bullmq"
import { envsafe, port, str, url } from "envsafe"

enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

const baseEnv = envsafe({
  NODE_ENV: str({
    choices: [
      Environment.Development,
      Environment.Test,
      Environment.Production,
    ],
    default: Environment.Production,
  }),
  PORT: port({
    devDefault: 3100,
  }),
  USER_AGENT: str({
    default: "@anisubs/worker (unknown)",
  }),

  MANAGER_URL: url({
    devDefault: "http://localhost:3000",
  }),
  TOKEN: str(),

  S3_DOMAIN: str(),
  SPACE_CLIENT: str(),
  SPACE_SECRET: str(),
})

const redisEnv = envsafe({
  REDIS_HOST: str({
    default: "",
    devDefault: "localhost",
  }),
  REDIS_PORT: port({
    default: 6379,
  }),
  REDIS_USER: str({
    default: "",
  }),
  REDIS_PASS: str({
    default: "",
  }),
})

export const CONFIG = {
  ...baseEnv,
  redis: {
    host: redisEnv.REDIS_HOST,
    port: redisEnv.REDIS_PORT,
    username: redisEnv.REDIS_USER,
    password: redisEnv.REDIS_PASS,
  } as RedisOptions,
}
