import { possibleTypes } from "@anisubs/graphql-types"
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core"

import { CONFIG } from "@/config"

const httpLink = createHttpLink({
  uri: `${CONFIG.VUE_APP_API_URL}/graphql`,
  credentials: "include",
})

const cache = new InMemoryCache({
  ...possibleTypes.possibleTypes,
  resultCaching: true,
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  assumeImmutableResults: true,
})
