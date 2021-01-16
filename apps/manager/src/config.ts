import { getRedisConfig } from "@anisubs/shared"
import { bool, envsafe, port, str, url } from "envsafe"
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
  USER_AGENT: str({
    default: "@anisubs/manager",
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

const redisEnv = envsafe({
  REDIS_URL: url({
    devDefault: "redis://localhost:6379/0",
  }),
})

const postgresEnv = envsafe({
  DATABASE_URL: url({
    devDefault: "postgresql://postgres:password@localhost:5432/postgres",
  }),
  DATABASE_SSL: bool({
    default: true,
    devDefault: false,
  }),
})

export const config = {
  ...baseEnv,
  ...anilistEnv,

  db: {
    type: "postgres",
    url: postgresEnv.DATABASE_URL,
    ssl: postgresEnv.DATABASE_SSL,

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
