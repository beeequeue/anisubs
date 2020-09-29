import Router from "koa-router"
import { addGraphQlRoute } from "@/graphql"

export const createRouter = async () => {
  const router = new Router()

  await addGraphQlRoute(router)

  return router
}
