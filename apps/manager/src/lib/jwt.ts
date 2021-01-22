import { sign, verify } from "jsonwebtoken"
import { Middleware } from "koa"

import { config } from "@/config"

export const JWT = {
  sign: (discordId: string, expiryDate: Date) =>
    sign(
      {
        discord: discordId,
      },
      config.TOKEN_SECRET,
      {
        issuer: "anisubs",
        audience: "you♥",
        expiresIn: Math.round(expiryDate.getTime() / 1000),
      },
    ),

  verify: (token: string) => verify(token, config.TOKEN_SECRET),
}

export const TokenMiddleware = (): Middleware => async (ctx, next) => {
  if (
    ctx.path.startsWith("/auth") ||
    ctx.path === "/.well-known/apollo/server-health"
  ) {
    return next()
  }

  const token = ctx.cookies.get("anisubs:token")

  if (token == null || !JWT.verify(token)) {
    ctx.status = 401
    return
  }

  await next()
}
