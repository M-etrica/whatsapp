import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import Pino from 'pino-http';
import _pino from 'pino';
import { RewriteFrames } from '@sentry/integrations';
import { randomUUID } from 'node:crypto';

import wsRouter from './components/whatsapp/whatsapp.router';

const app = express();

const pino = Pino({
  logger: _pino(),
  genReqId(req: Request, res: Response) {
    if (req.id) return req.id;
    let id = req.get('X-Request-Id');
    if (id) return id;
    id = randomUUID();
    res.header('X-Request-Id', id);
    return id;
  },
});

const PORT = Number(process.env.PORT);

app.set('port', PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    })
  );
}
app.use(cors());

app.use(pino);

app.use('/api', wsRouter);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5,
    integrations: [
      new RewriteFrames({
        root: global.__rootdir__,
      }),
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Mongo({ useMongoose: true }),
      new Tracing.Integrations.Express({ app }),
    ],
  });
}

export default app;
