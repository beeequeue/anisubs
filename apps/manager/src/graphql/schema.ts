import { resolve } from "path"

import { buildSchema } from "type-graphql"
import { Container } from "typedi"

import { config } from "@/config"

export const createSchema = async (generateSnapshot = true) =>
  buildSchema({
    emitSchemaFile:
      !generateSnapshot || config.nodeEnv === "test"
        ? false
        : { path: resolve(__dirname, "snapshot.graphql") },
    dateScalarMode: "isoDate",
    resolvers: [resolve(__dirname, "../modules/**/*.resolvers.ts")],
    // TODO: Clean up container
    container: () => Container.of(Math.random() * Number.MAX_SAFE_INTEGER),
  })
