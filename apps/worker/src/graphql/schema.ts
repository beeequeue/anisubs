import { resolve } from "path"

import { buildSchema } from "type-graphql"
import { Container } from "typedi"

import { CONFIG } from "@/config"

export const createSchema = async (generateSnapshot = true) =>
  buildSchema({
    emitSchemaFile:
      !generateSnapshot || CONFIG.NODE_ENV === "test"
        ? false
        : { path: resolve(__dirname, "snapshot.graphql") },
    dateScalarMode: "isoDate",
    resolvers: [resolve(__dirname, "../modules/**/*.resolvers.ts")],
    // TODO: Clean up container
    container: () => Container.of(Math.random() * Number.MAX_SAFE_INTEGER),
  })
