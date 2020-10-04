import Koa from "koa"

import { createRouter } from "@/rest"

export const createApp = async () => {
  const app = new Koa()

  const router = await createRouter()
  app.use(router.routes()).use(router.allowedMethods())

  return app
}
