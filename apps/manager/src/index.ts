import { createApp } from "@/app"
import { config } from "@/config"

const run = async () => {
  const app = await createApp()

  app.listen(config.port, () => {
    console.log(`Listening on ${config.port}...`)
  })
}

run()
