import env from './utils/env';
import app from './app';
import logger from './utils/logger';

try {
  // Listen the API on port 3000 (default)
  app.listen(env.api.port, () => {
    logger.info(`Node environment: ${process.env.NODE_ENV}`);
    logger.info(`Listening on port ${env.api.port}`);
  });
} catch (error) {
  logger.error(error);
}
