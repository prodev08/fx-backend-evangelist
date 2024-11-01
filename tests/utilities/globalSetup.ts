import '../../src/initializers';
import app from '../../src/express';
import createApolloServer from '../../src/apollo';
import {createServer} from 'http';
const {PORT = 8080} = process.env;

export default async function () {
  const server = createServer(app);
  const apollo = createApolloServer();
  await apollo.start();
  apollo.applyMiddleware({app});
  server.listen({port: PORT}, () => {
    process.stdout.write(`Server ready at http://localhost:${PORT}\n`);
  });
}
