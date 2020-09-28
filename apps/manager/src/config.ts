import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

const errors: string[] = []

const envVar = <T extends string, D extends T | undefined = T>(
  key: string,
  defaultValue?: D,
): D extends undefined ? T | undefined : T => {
  const value = process.env[key] as T | undefined

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return (value || defaultValue) as any
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

  db: PostgresConnectionOptions
}

export const config: Config = {
  nodeEnv: envVar("NODE_ENV", Environment.Production),
  appEnv: envVar("APP_ENV", Environment.Production),
  port: Number(envVar("PORT", 3000)),

  db: {
    type: "postgres",
    host: envVar("DATABASE_HOST", "localhost"),
    port: Number(envVar("DATABASE_PORT", 5432)),
    username: envVar("DATABASE_USER", "postgres"),
    password: envVar("DATABASE_PASS"),
    url: envVar("DATABASE_URL"),
    ssl: envVar("DATABASE_SSL") === "true",
    database: "postgres",

    migrationsRun: true,

    entities: ["src/**/*.model.ts"],
    migrations: ["migrations/**/*.ts"],
    cli: {
      entitiesDir: "src/modules",
      migrationsDir: "migrations",
    },
  },
}

if (config.nodeEnv !== "test" && errors.length > 0) {
  throw new Error(`Invalid config!\n  • ${errors.join("\n  • ")}`)
}
