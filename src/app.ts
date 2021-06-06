import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import promClient from 'prom-client';

import { internalServerError, notFound } from './utils/responses';
import { Error } from './types';
import logger, { morgan } from './utils/logger';
import env from './utils/env';
import exporter from './exporter/exporter';
import { collectMetrics } from './exporter/metrics';

const app = express();

(async () => {
  promClient.collectDefaultMetrics();
  await collectMetrics();

  setInterval(() => collectMetrics(), env.metricCollectionInterval * 1000);

  app.use(morgan());

  // Security middlewares
  app.use(cors(), helmet());

  app.get(env.api.prefix, exporter);

  // Not found
  app.use((request: Request, response: Response) => notFound(response, Error.RouteNotFound));

  // Error Handles
  // The eslint disabling is important because the error argument can only be gotten in the 4 arguments function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => {
    logger.error(error);
    return internalServerError(response);
  });
})().catch((error) => {
  logger.error(error);
  process.exit(1);
});
export default app;
