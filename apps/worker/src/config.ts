import { getRedisConfig } from "@anisubs/shared"
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
    default: Environment.Development,
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
})

const redisEnv = envsafe({
  REDIS_URL: url({
    devDefault: "redis://localhost:6379/0",
  }),
})

export const CONFIG = {
  ...baseEnv,

  redis: getRedisConfig(redisEnv.REDIS_URL),
}
