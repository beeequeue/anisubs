import { envsafe, str } from "envsafe"

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
    input: process.env.NODE_ENV,
  }),

  VUE_APP_CDN_URL: str({
    default: "https://cdn.anisubs.com/",
    devDefault: "http://localhost:3000/cdn",
    input: process.env.VUE_APP_CDN_URL,
  }),
  VUE_APP_API_URL: str({
    default: "https://api.anisubs.com",
    devDefault: "http://localhost:3000",
    input: process.env.VUE_APP_API_URL,
  }),
})

export const CONFIG = {
  ...baseEnv,
}
