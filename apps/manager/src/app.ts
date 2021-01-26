import { resolve } from "path"

import { config } from "@/config"
import { registerApolloServer } from "@/graphql"
import { TokenMiddleware } from "@/lib/jwt"
import { createRouter } from "@/rest"
import Cors from "@koa/cors"
import Koa from "koa"
import Helmet from "koa-helmet"
import Serve from "koa-static-server"
import { v4 as uuid } from "uuid"

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

export const createApp = async () => {
  const app = new Koa<KoaContext>()

  app.use(
    Cors({
      origin:
        config.NODE_ENV === "production"
          ? "https://anisubs.app"
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
            (ctx) => ctx.request.header.origin,
      credentials: true,
    }),
  )
  app.use(Helmet())

  if (process.env.NODE_ENV === "production") {
    app.use(TokenMiddleware())
  }

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
      maxage: config.NODE_ENV === "development" ? 0 : SEVEN_DAYS,
    }),
  )

  return app
}
