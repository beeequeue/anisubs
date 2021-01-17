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
    formatError: (error) => (console.error(error), error),
    introspection: true,
    uploads: false,
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse: ({ context }) => {
            Container.reset((context as Context).state.requestId)
          },
        }),
      },
    ],
  })

  server.applyMiddleware({
    app: app as Koa,
    cors: {
      origin: "anisubs.app",
    },
  })
}
