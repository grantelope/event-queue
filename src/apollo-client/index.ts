import { ApolloClient, HttpLink, from, split } from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";
import initCache from "./init-cache";

const ssrMode = typeof window === "undefined";
const cache = initCache({});
const httpLink = new HttpLink({
  uri: "/graphql",
});

let link = httpLink;

if (!ssrMode) {
  link = split(({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  }, httpLink);
}

/**
 * Apollo's client-side
 *
 * @see https://www.apollographql.com/docs/react/api/core/ApolloClient
 */
export const client = new ApolloClient({
  link: from([link]),
  cache,
  ssrMode,
  connectToDevTools: !ssrMode,
  name: "users-app-client",
});
