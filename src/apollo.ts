import * as Sentry from '@sentry/node';
import {ApolloServer} from 'apollo-server-express';
import {GraphQLError} from 'graphql';
import context from './nexus/context';
import stringify from 'json-stringify-safe';
import {connectionPlugin, fieldAuthorizePlugin, makeSchema, nullabilityGuardPlugin} from 'nexus';
import * as types from './nexus';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
// const ignoreErrors = ['AuthenticationError', 'UserInputError', 'ForbiddenError'];
const formatError = (error: GraphQLError) => {
  // const name = error.originalError?.name || error.name;
  console.error(error.extensions?.exception?.stacktrace);
  // if (!ignoreErrors.includes(name)) {
  Sentry.captureException(error);
  // }
  return error;
};

const formatResponse = (res: any) => {
  if (res.errors) {
    try {
      JSON.stringify(res.errors);
    } catch (err) {
      res.errors = JSON.parse(stringify(res.errors));
    }
  }
  return res;
};

export default () => {
  const schema = makeSchema({
    types,
    plugins: [
      fieldAuthorizePlugin(),
      connectionPlugin({includeNodesField: true}),
      nullabilityGuardPlugin({
        shouldGuard: true,
        fallbackValues: {
          ID: () => 'MISSING_ID',
          Int: () => 0,
          Boolean: () => false,
          String: () => '',
          Float: () => 0,
          JSON: () => {},
        },
      }),
    ],
  });
  return new ApolloServer({
    schema,
    context,
    formatError,
    formatResponse,
    introspection: global.appEnv !== 'production',
    plugins: [
      global.appEnv === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
};
