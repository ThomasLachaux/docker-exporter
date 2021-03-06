import { Response } from 'express';
import { Error } from '../types';
import logger from './logger';

export const success = (response: Response, body: unknown): void => response.status(200).json(body).end();

export const created = (response: Response, body?: unknown): void => {
  if (body) {
    return response.status(201).json(body).end();
  }

  return response.status(201).end();
};

export const noContent = (response: Response): void => response.status(204).end();

const respondError = (response: Response, error: Error, code: number) => {
  const message = `[${code}] ${error}`;

  // We use logger.debug to not display the error in production as it will be used in dev and test
  logger.http(message);

  return response.status(code).json({ error }).end();
};

export const notFound = (response: Response, error: Error): void => respondError(response, error, 404);

export const internalServerError = (response: Response, error?: Error): void =>
  respondError(response, error || Error.InternalServerError, 500);
