/* eslint-disable consistent-return */
import dotenv from 'dotenv';

dotenv.config();

// Load dotenv only if we are not in testing
// The testing must be able to be loaded without any environment variable except the DATABASE
// We had to use a function to check if we are in testing environment instead of just loading dotenv if we are not
// The reason is because prisma also loads dotenv and injects the variables
// We however allow some variables like database credentials in testing environment
const loadEnv = (key: string, allowedInTesting = false) => {
  // If we are in test env, do not inject dotenv variables
  if (process.env.NODE_ENV === 'test' && !allowedInTesting) {
    return;
  }
  // Return the loaded environment key
  return process.env[key];
};

const loadIntEnv = (key: string, allowedInTesting = false) => Number(loadEnv(key, allowedInTesting));

// Returns the key only if we are not in production
// Used when you want to have a default option for only testing and dev environment
// An example is to make sure you don't put fake credentials in a production environoemnt
export const notInProduction = <T = string>(key: T) => {
  if (process.env.NODE_ENV !== 'production') {
    return key;
  }
};

const env = {
  development: process.env.NODE_ENV === 'development',
  production: process.env.NODE_ENV === 'production',
  api: {
    port: loadIntEnv('API_PORT') || 3000,
    prefix: loadEnv('API_PREFIX') || '/',
  },
};

// Create a warn log array to use it after winsotn initialization
// We can't import Winsotn as there would be a circular dependency because winston depends of this file
export const warnLogs: string[] = [];

const optionalVariables: String[] = [];

const throwOrWarn = (key: string, reason: string) => {
  const message = `[${key}] ${reason}`;

  // We only use the litteral check because the env.development variable is not defined yet
  // Check if we are not in production or the variable is optional
  if (process.env.NODE_ENV !== 'production' || optionalVariables.includes(key)) {
    // Push the warn log to the array
    warnLogs.push(message);
  } else {
    throw new TypeError(message);
  }
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
      throwOrWarn(currentKey, 'The variable is not a number');
    }
    // Checks, if the value is a string, that the length is not equals to 0
    if (typeof value === 'string' && value.length === 0) {
      throwOrWarn(currentKey, 'The variable is empty');
    }

    // If the variable is an object, checks below
    if (typeof value === 'object') {
      checkConfiguration(value, currentKey);
    }

    // And finally checks the value is not undefined
    if (value === undefined) {
      throwOrWarn(currentKey, 'The variable is undefined');
    }
  }
};

checkConfiguration(env);

export default env;
