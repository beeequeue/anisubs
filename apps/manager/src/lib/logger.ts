import Pino from "pino"

import { config } from "@/config"

export const Logger = Pino({
  level: config.LOG_LEVEL,
  enabled: config.NODE_ENV === "production",
})
