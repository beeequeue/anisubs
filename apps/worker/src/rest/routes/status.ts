import { WorkerStatusResponse } from "@anisubs/shared"
import Router from "koa-router"

import { useState } from "@/state"

export const statusRouter = new Router()

statusRouter.prefix("/status")

statusRouter.get("/", (ctx) => {
  ctx.response.body = useState() as WorkerStatusResponse
})
