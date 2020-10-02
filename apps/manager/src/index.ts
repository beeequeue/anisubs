import "reflect-metadata"

import { createApp } from "@/app"
import { config } from "@/config"
import { connectToDatabase } from "@/db"

const run = async () => {
  await connectToDatabase()

  const app = await createApp()

  app.listen(config.port, () => {
    console.log(`Listening on ${config.port}...`)
  })
}

void run()
