import { Middleware } from "koa"

import { CONFIG } from "@/config"

export const TokenMiddleware = (): Middleware => async (ctx, next) => {
  const authHeader = ctx.req.headers.authorization?.split(" ") ?? []

  if (authHeader[0] !== "Bearer" || authHeader[1] !== CONFIG.TOKEN) {
    ctx.response.status = 401
    return
  }

  await next()
}
