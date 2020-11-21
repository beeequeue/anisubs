import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core"

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL,
})

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    query: { fetchPolicy: "cache-first" },
    mutate: { fetchPolicy: "no-cache" },
  },
  assumeImmutableResults: true,
})
