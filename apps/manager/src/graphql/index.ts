import { ApolloServer } from "apollo-server-koa"
import type Koa from "koa"
import { Container } from "typedi"

import { createSchema } from "@/graphql/schema"

export const registerApolloServer = async (app: Koa<KoaContext>) => {
  const schema = await createSchema(true)
  const server = new ApolloServer({
    schema,
    context: ({
      ctx: { req, res, state },
    }: {
      ctx: Koa.ParameterizedContext<KoaContext>
    }): Context => ({
      req,
      res,
      state,
    }),
    introspection: true,
    uploads: false,
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse: async ({ context }) => {
            Container.reset(context.state.requestId)
          },
        }),
      },
    ],
  })

  server.applyMiddleware({ app: app as Koa })
}
