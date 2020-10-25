import Koa from "koa"

import { createRouter } from "@/rest"
import { TokenMiddleware } from "@/rest/middlewares"

export const createApp = async () => {
  const app = new Koa()

  app.use(TokenMiddleware())

  const router = await createRouter()
  app.use(router.routes()).use(router.allowedMethods())

  return app
}
