import { decode } from "jsonwebtoken"
import Router from "koa-router"

import { discordRouter } from "@/rest/discord"

// eslint-disable-next-line @typescript-eslint/require-await
export const createRouter = async () => {
  const router = new Router()

  router.get("/me", (ctx) => {
    const data = decode(ctx.cookies.get("anisubs:token")!) as Record<
      string,
      unknown
    >

    ctx.body = { id: data?.discord }
  })

  router.use(discordRouter.routes())
  router.use(discordRouter.allowedMethods())

  return router
}
