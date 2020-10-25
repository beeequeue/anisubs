import "reflect-metadata"

import { createApp } from "@/app"
import { CONFIG } from "@/config"
import { Manager } from "@/lib/manager"

const run = async () => {
  const app = await createApp()

  await Manager.confirmSelf()

  app.listen(CONFIG.PORT, () => {
    console.log(`Listening on ${CONFIG.PORT}...`)
  })
}

void run()
