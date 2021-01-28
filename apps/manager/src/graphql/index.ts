import { ApolloServer } from "apollo-server-koa"
import type Koa from "koa"
import { Container } from "typedi"

import { createSchema } from "@/graphql/schema"
import { Logger } from "@/lib/logger"

export const registerApolloServer = async (app: Koa<KoaContext>) => {
  const schema = await createSchema(true)
  const server = new ApolloServer({
    schema,
    context: ({
      ctx: { req, res, state, log },
    }: {
      ctx: Koa.ParameterizedContext<KoaContext>
    }): Context => ({
      log,
      req,
      res,
      state,
    }),
    formatError: (error) => (Logger.error(error), error),
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
    cors: false,
  })
}
