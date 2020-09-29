import graphqlHTTP from "koa-graphql"
import type Router from "koa-router"

import { createSchema } from "@/graphql/schema"

export const addGraphQlRoute = async (router: Router) => {
  const schema = await createSchema(true)

  router.post(
    "/graphql",
    graphqlHTTP({
      schema,
      pretty: true,
    }),
  )
}
