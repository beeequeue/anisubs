import { ApolloServer } from "apollo-server-koa"
import type Koa from "koa"

import { createSchema } from "@/graphql/schema"

export const registerApolloServer = async (app: Koa) => {
  const schema = await createSchema(true)
  const server = new ApolloServer({
    schema,
    context: ({ ctx: { req, res } }: { ctx: Koa.Context }): Context => ({
      req,
      res,
    }),
    introspection: true,
    uploads: false,
  })

  server.applyMiddleware({ app })
}
