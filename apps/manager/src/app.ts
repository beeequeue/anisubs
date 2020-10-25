import Koa from "koa"
import { v4 as uuid } from "uuid"

import { createRouter } from "@/rest"

import { registerApolloServer } from "./graphql"

export const createApp = async () => {
  const app = new Koa<KoaContext>()

  app.use(async (ctx, next) => {
    ctx.state.requestId = uuid()

    await next()
  })

  const router = await createRouter()
  app.use(router.routes()).use(router.allowedMethods())

  await registerApolloServer(app)

  return app
}
