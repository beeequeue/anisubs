import "reflect-metadata"

import { createApp } from "@/app"
import { config } from "@/config"
import { connectToDatabase } from "@/db"
import { Logger } from "@/lib/logger"

const run = async () => {
  await connectToDatabase()

  const app = await createApp()

  app.listen(config.PORT, () => {
    Logger.info(`Listening on ${config.PORT}...`)
  })
}

void run()
