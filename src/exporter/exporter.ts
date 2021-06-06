import promClient from 'prom-client';
import { Request, Response, NextFunction } from 'express';

export default async (request: Request, response: Response, next: NextFunction) => {
  try {
    const metrics = await promClient.register.metrics();

    response.set('Content-Type', promClient.register.contentType);
    return response.end(metrics);
  } catch (error) {
    return next(error);
  }
};
