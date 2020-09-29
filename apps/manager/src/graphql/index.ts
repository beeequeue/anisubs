// TODO: import { sentry as SentryGraphql } from "graphql-middleware-sentry"

import graphqlHTTP from "koa-graphql"
import type Router from "koa-router"

import { createSchema } from "@/graphql/routes"

export const addGraphQlRoute = async (router: Router) => {
  const schema = await createSchema(true)

  router.post("/graphql", graphqlHTTP({
    schema,
    pretty: true,
  }))
}
