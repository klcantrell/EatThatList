import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode, FragmentDefinitionNode } from 'graphql';

const GRAPHQL_HTTP_ENDPOINT = 'https://eat-that-list.herokuapp.com/v1/graphql';
const GRAPHQL_WS_ENDPOINT = 'ws://eat-that-list.herokuapp.com/v1/graphql';

const cache = new InMemoryCache();
const createHttpLink = (token: string) =>
  new HttpLink({
    uri: GRAPHQL_HTTP_ENDPOINT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
const createWsLink = (token: string) =>
  new WebSocketLink({
    uri: GRAPHQL_WS_ENDPOINT,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  });

const createGraphqlClient = (token: string) => {
  return new ApolloClient({
    cache,
    link: split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      createWsLink(token),
      createHttpLink(token)
    ),
  });
};

export { createGraphqlClient };
