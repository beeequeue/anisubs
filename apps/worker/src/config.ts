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
})

export const CONFIG = {
  ...baseEnv,
}
