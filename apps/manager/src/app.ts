import { resolve } from "path"

import Koa from "koa"
import Serve from "koa-static-server"
import { v4 as uuid } from "uuid"

import { config } from "@/config"
import { createRouter } from "@/rest"

import { registerApolloServer } from "./graphql"

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

export const createApp = async () => {
  const app = new Koa<KoaContext>()

  app.use(async (ctx, next) => {
    ctx.state.requestId = uuid()

    await next()
  })

  const router = await createRouter()
  app.use(router.routes()).use(router.allowedMethods())

  await registerApolloServer(app)

  app.use(
    Serve({
      rootPath: "/cdn",
      rootDir: resolve(__dirname, "..", "..", "..", "output/screenshots"),
      maxage: config.nodeEnv === "development" ? 0 : SEVEN_DAYS,
    }),
  )

  return app
}
