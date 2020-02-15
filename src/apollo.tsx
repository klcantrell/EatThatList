import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const GRAPHQL_ENDPOINT = 'https://eat-that-list.herokuapp.com/v1/graphql';

const cache = new InMemoryCache();
const createLink = token =>
  new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const createGraphqlClient = token => {
  console.log(token);
  return new ApolloClient({
    cache,
    link: createLink(token),
  });
};

export { createGraphqlClient };
