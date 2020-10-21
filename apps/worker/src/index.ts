import "reflect-metadata"

import { createApp } from "@/app"
import { CONFIG } from "@/config"

const run = async () => {
  const app = await createApp()

  app.listen(CONFIG.PORT, () => {
    console.log(`Listening on ${CONFIG.PORT}...`)
  })
}

void run()
