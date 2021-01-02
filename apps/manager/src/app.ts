import { resolve } from "path"

import Koa from "koa"
import Serve from "koa-static-server"
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

  if (process.env.NODE_ENV === "development") {
    app.use(
      Serve({
        rootPath: "/cdn",
        rootDir: resolve(__dirname, "..", "..", "..", "output/screenshots"),
      }),
    )
  }

  return app
}
