import "reflect-metadata"

import { createApp } from "@/app"
import { CONFIG } from "@/config"
import { Manager } from "@/lib/manager"
import { startWorker } from "@/lib/queue"

const run = async () => {
  const app = await createApp()

  await Manager.confirmSelf()

  startWorker()

  app.listen(CONFIG.PORT, () => {
    console.log(`Listening on ${CONFIG.PORT}...`)
  })
}

void run()
