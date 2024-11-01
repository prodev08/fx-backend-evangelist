import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import app from './express';
import _ from 'lodash';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: _.upperFirst(_.toLower(process.env.APP_ENV!)),
  sampleRate: 1.0,
  attachStacktrace: true,
  normalizeDepth: 5,
  normalizeMaxBreadth: 1500,
  // debug: true,
  enabled: global.appEnv !== 'develop',
  // enabled: true,
  // ignoreErrors: ['AuthenticationError', 'UserInputError', 'ForbiddenError'],
  integrations: [
    new Sentry.Integrations.Http({tracing: true}),
    new Tracing.Integrations.Mongo({
      useMongoose: true,
    }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1.0,
});
