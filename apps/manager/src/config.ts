import { RedisOptions } from "ioredis"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

const errors: string[] = []

const envVar = <T extends string, D extends T | undefined = T>(
  key: string,
  defaultValue?: D,
): D extends undefined ? T | undefined : T => {
  const value = process.env[key] as T | undefined

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (value || defaultValue) as never
}

// const requiredEnvVar = <T extends string = string>(key: string) => {
//   const value = envVar(key)
//
//   if (value == null || value.length < 1) {
//     errors.push(`Env variable \`${key}\` is required but was not found.`)
//   }
//
//   return value as T
// }

enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

type Config = {
  nodeEnv: Environment
  appEnv: Environment.Development | Environment.Production
  port: number
  userAgent: string

  anilist: {
    url: string
    token?: string
  }

  db: PostgresConnectionOptions

  redis: RedisOptions
}

export const config: Config = {
  nodeEnv: envVar("NODE_ENV", Environment.Production),
  appEnv: envVar("APP_ENV", Environment.Production),
  port: Number(envVar("PORT", 3000)),
  userAgent: "@anisubs/manager",

  anilist: {
    url: "https://graphql.anilist.co",
    token: envVar("ANILIST_TOKEN"),
  },

  db: {
    type: "postgres",
    host: envVar("DATABASE_HOST", "localhost"),
    port: Number(envVar("DATABASE_PORT", 5432)),
    username: envVar("DATABASE_USER", "postgres"),
    password: envVar("DATABASE_PASS"),
    url: envVar("DATABASE_URL"),
    ssl: envVar("DATABASE_SSL") === "true",
    database: envVar("DATABASE_DB", envVar("DATABASE_DATABASE", "postgres")),

    migrationsRun: true,
    // TODO: remove after creating first migration
    synchronize: envVar("NODE_ENV") === "development",

    entities: ["src/**/*.model.ts"],
    migrations: ["migrations/**/*.ts"],
    cli: {
      entitiesDir: "src/modules",
      migrationsDir: "migrations",
    },
  },

  redis: {
    host: envVar("REDIS_HOST", "localhost"),
    port: Number(envVar("REDIS_PORT", 6739)),
    username: envVar("REDIS_USER"),
    password: envVar("REDIS_PASS"),
  },
}

if (config.nodeEnv !== "test" && errors.length > 0) {
  throw new Error(`Invalid config!\n  • ${errors.join("\n  • ")}`)
}
