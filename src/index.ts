import 'dotenv/config';
import './initializers';
import './sentry';
import './app/cronJobs/scheduleReminderEmailsCron';
import app from './express';
import createApolloServer from './apollo';
import websocket from './websocket';
import {createServer} from 'http';
import * as Sentry from '@sentry/node';
const {PORT = 8080} = process.env;

async function main() {
  const server = createServer(app);
  const apollo = createApolloServer();
  await apollo.start();
  websocket(server);
  apollo.applyMiddleware({app});
  app.use(Sentry.Handlers.errorHandler());
  server.listen({port: PORT}, () => {
    process.stdout.write(`Server ready at http://localhost:${PORT}\n`);
  });
}

main().then();
