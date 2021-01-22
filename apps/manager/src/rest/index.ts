import Router from "koa-router"

import { discordRouter } from "@/rest/discord"

// eslint-disable-next-line @typescript-eslint/require-await
export const createRouter = async () => {
  const router = new Router()

  router.use(discordRouter.routes())
  router.use(discordRouter.allowedMethods())

  return router
}
