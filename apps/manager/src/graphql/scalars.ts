import { GraphQLScalarType, Kind } from "graphql"

const timestampRegex = /^\d{2,3}:\d{2}(?::\d{1,6})?$/

export const Timestamp = new GraphQLScalarType({
  name: "Timestamp",
  parseValue(value: unknown): string {
    if (typeof value !== "string") {
      throw new Error("Timestamp has to be a string.");
    }

    if (!timestampRegex.test(value)) {
      throw new Error("Timestamp has to follow the following format: `MM:SS` or `MM:SS:MS`.");
    }

    return value; // value from the client input variables
  },
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error("Timestamp has to be a string.");
    }

    if (!timestampRegex.test(ast.value)) {
      throw new Error("Timestamp has to follow the following format: `MM:SS` or `MM:SS:MS`.");
    }

    return ast.value; // value from the client query
  },
})
