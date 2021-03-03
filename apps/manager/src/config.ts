import { getRedisConfig } from "@anisubs/shared"
import { envsafe, port, str, url } from "envsafe"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

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
    devDefault: 3000,
  }),
  LOG_LEVEL: str({
    default: "info",
    devDefault: "debug",
    choices: ["fatal", "error", "warn", "info", "debug", "trace"],
  }),
  USER_AGENT: str({
    default: "@anisubs/manager",
  }),

  TOKEN_SECRET: str({
    devDefault: "kitten",
  }),
  COOKIE_DOMAIN: str({
    default: ".anisubs.app",
    devDefault: "localhost",
  }),
})

const anilistEnv = envsafe({
  ANILIST_URL: url({
    default: "https://graphql.anilist.co",
  }),
  ANILIST_TOKEN: str({
    default: "",
    allowEmpty: true,
  }),
})

const discordEnv = envsafe({
  DISCORD_CLIENT_ID: str(),
  DISCORD_SECRET: str(),
  DISCORD_CALLBACK_URL: url({
    default: "https://api.anisubs.app/auth/discord/callback",
    devDefault: "http://localhost:3000/auth/discord/callback",
  }),
  DISCORD_SUCCESS_REDIRECT: url({
    default: "https://api.anisubs.app",
    devDefault: "http://localhost:8080",
  }),
  DISCORD_ERROR_REDIRECT: url({
    default: "https://api.anisubs.app/login",
    devDefault: "http://localhost:8080/login",
  }),
})

const redisEnv = envsafe({
  REDIS_URL: url({
    devDefault: "redis://localhost:6379/0",
  }),
})

const postgresEnv = envsafe({
  DATABASE_URL: url({
    devDefault: "postgresql://postgres:password@localhost:5432/postgres",
  }),
})

export const config = {
  ...baseEnv,
  ...anilistEnv,
  ...discordEnv,

  db: {
    type: "postgres",
    url: postgresEnv.DATABASE_URL,

    migrationsRun: true,

    entities: ["src/**/*.model.ts"],
    migrations: ["migrations/**/*.ts"],
    cli: {
      entitiesDir: "src/modules",
      migrationsDir: "migrations",
    },
  } as PostgresConnectionOptions,

  redis: getRedisConfig(redisEnv.REDIS_URL),
}
