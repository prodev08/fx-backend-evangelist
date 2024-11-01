import express from 'express';
import * as Sentry from '@sentry/node';
// import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';

import health from './health';
import root from './root';
import photos from './photos';
import sports from './sports';
import sitemap from './sitemap';

const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));

health(app);
root(app);
photos(app);
sports(app);
sitemap(app);

export default app;
