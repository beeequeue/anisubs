import { URL, URLSearchParams } from "url"

import Router from "koa-router"

import { config } from "@/config"
import { HttpClient } from "@/http"
import { JWT } from "@/lib/jwt"
import { responseIsError } from "@/lib/utils"

const discordBaseUrl = "https://discord.com/api"
const DiscordHttpClient = HttpClient.extend({
  prefixUrl: discordBaseUrl,
})

const scope = "identify"

export const discordRouter = new Router()

// Prefix
discordRouter.prefix("/auth/discord")

// Authorize
const searchParams = new URLSearchParams({
  response_type: "code",
  prompt: "none",
  scope,
  client_id: config.DISCORD_CLIENT_ID,
  redirect_uri: config.DISCORD_CALLBACK_URL,
})
const authorizeUrl = new URL(
  `${discordBaseUrl}/oauth2/authorize?${searchParams.toString()}`,
)

discordRouter.get("/", (ctx) => ctx.redirect(authorizeUrl.toString()))

// Callback
discordRouter.get("/callback", async (ctx) => {
  const params = new URLSearchParams(ctx.request.search)
  const code = params.get("code")

  if (code == null) {
    return ctx.redirect(
      config.DISCORD_ERROR_REDIRECT + `?error=Did not get token from Discord.`,
    )
  }

  const tokenResponse = await DiscordHttpClient.post<{ access_token: string }>(
    "oauth2/token",
    {
      throwHttpErrors: false,
      form: {
        code,
        scope,
        grant_type: "authorization_code",
        client_id: config.DISCORD_CLIENT_ID,
        client_secret: config.DISCORD_SECRET,
        redirect_uri: config.DISCORD_CALLBACK_URL,
      },
    },
  )

  if (responseIsError(tokenResponse)) {
    console.error(tokenResponse.body)
    return ctx.redirect(config.DISCORD_ERROR_REDIRECT)
  }

  const userResponse = await DiscordHttpClient.get<{ id: string }>(
    "users/@me",
    {
      throwHttpErrors: false,
      headers: {
        Authorization: `Bearer ${tokenResponse.body.access_token}`,
      },
    },
  )

  if (responseIsError(userResponse)) {
    console.error(userResponse.body)
    return ctx.redirect(config.DISCORD_ERROR_REDIRECT)
  }

  const expiryDate = new Date(new Date().setDate(new Date().getDate() + 30))
  const token = JWT.sign(userResponse.body.id, expiryDate)

  ctx.cookies.set("anisubs:token", token, {
    domain: config.COOKIE_DOMAIN,
    httpOnly: true,
    expires: expiryDate,
    sameSite: "lax",
    secure: config.NODE_ENV === "production",
  })

  ctx.redirect(config.DISCORD_SUCCESS_REDIRECT)
})
