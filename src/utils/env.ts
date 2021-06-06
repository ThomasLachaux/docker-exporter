/* eslint-disable consistent-return */
import dotenv from 'dotenv';

dotenv.config();

// Returns the key only if we are not in production
// Used when you want to have a default option for only testing and dev environment
// An example is to make sure you don't put fake credentials in a production environoemnt
export const notInProduction = <T = string>(key: T) => {
  if (process.env.NODE_ENV !== 'production') {
    return key;
  }
};

const loadDockerConfig = () => {
  const config: { authenticated: boolean; name: string; username?: string; password?: string }[] = [];
  const configLength = Number(process.env.DOCKER_CONFIG_LENGTH);

  if (!configLength) throw new Error('The docker config length is undefined');

  for (let index = 0; index < configLength; index += 1) {
    config.push({
      authenticated: process.env[`DOCKER_${index}_AUTHENTICATED`] === 'true',
      name: process.env[`DOCKER_${index}_NAME`],
      username: process.env[`DOCKER_${index}_USERNAME`],
      password: process.env[`DOCKER_${index}_PASSWORD`],
    });
  }

  return config;
};

const env = {
  development: process.env.NODE_ENV === 'development',
  production: process.env.NODE_ENV === 'production',
  metricCollectionInterval: Number(process.env.METRIC_COLLECTION_INTERVAL),
  api: {
    port: Number(process.env.API_PORT) || 3000,
    prefix: process.env.API_PREFIX || '/',
  },

  docker: {
    configLength: Number(process.env.DOCKER_CONFIG_LENGTH),
    configs: loadDockerConfig(),
  },
};

/**
 * Checks the configuration to not have any empty configuration variable.
 *
 * @private
 * @param {object} config - Configuration variable.
 */
const checkConfiguration = (config: object, parentKey = 'env') => {
  // Foreach config key, checks if it has a non null value
  for (const [key, value] of Object.entries(config)) {
    // Defines the key that will be displayed in case of an error
    const currentKey = `${parentKey}.${key}`;

    // Checks if NaN if the value is a number
    if (typeof value === 'number' && Number.isNaN(value)) {
      throw new TypeError(`${currentKey} is not a number`);
    }
    // Checks, if the value is a string, that the length is not equals to 0. And checks that the key is not username or password as the key is optionnal
    if (
      typeof value === 'string' &&
      value.length === 0 &&
      !currentKey.endsWith('username') &&
      !currentKey.endsWith('password')
    ) {
      throw new Error(`${currentKey} is empty`);
    }

    // If the variable is an object, checks below
    if (typeof value === 'object') {
      checkConfiguration(value, currentKey);
    }

    // And finally checks the value is not undefined
    if (value === undefined && !currentKey.endsWith('username') && !currentKey.endsWith('password')) {
      throw new Error(`${currentKey} is undefined`);
    }
  }
};

checkConfiguration(env);
export default env;
