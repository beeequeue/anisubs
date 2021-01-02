import { envsafe, port, str } from "envsafe"

enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

const baseEnv = envsafe(
  {
    NODE_ENV: str({
      choices: [
        Environment.Development,
        Environment.Test,
        Environment.Production,
      ],
      default: Environment.Development,
      input: process.env.NODE_ENV,
    }),
    PORT: port({
      devDefault: 3100,
      input: process.env.PORT,
    }),

    VUE_APP_ENV: str({
      choices: [Environment.Development, Environment.Production],
      default: Environment.Development,
      input: process.env.VUE_APP_ENV,
    }),

    VUE_APP_CDN_URL: str({
      default: "https://cdn.anisubs.com/",
      devDefault: "http://localhost:3000/cdn",
      input: process.env.VUE_APP_CDN_URL,
    }),
    VUE_APP_GRAPHQL_URL: str({
      default: "https://api.anisubs.com/graphql",
      devDefault: "http://localhost:3000/graphql",
      input: process.env.VUE_APP_GRAPHQL_URL,
    }),
  },
  {
    treatEmptyAsNull: true,
  },
)

export const CONFIG = {
  ...baseEnv,
}
