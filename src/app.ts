import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import { internalServerError, notFound } from './utils/responses';
import { Error } from './types';
import logger from './utils/logger';

const app = express();

app.use(morgan('combined'));

// Security middlewares
app.use(cors(), helmet());

// Not found
app.use((request: Request, response: Response) => notFound(response, Error.RouteNotFound));

// Error Handles
// The eslint disabling is important because the error argument can only be gotten in the 4 arguments function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => {
  logger.error(error);
  return internalServerError(response);
});

export default app;
