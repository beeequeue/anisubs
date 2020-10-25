import Router from "koa-router"

import { statusRouter } from "@/rest/routes/status"

export const createRouter = async () => {
  const router = new Router()

  router.use(statusRouter.routes())
  router.use(statusRouter.allowedMethods())

  return router
}
