import axios, { AxiosRequestConfig } from 'axios';
import logger from '../utils/logger';

interface DockerResponse {
  limit: number;
  remaining: number;
}

export default class Docker {
  token: string;

  authenticated: boolean;

  username: string;

  password: string;

  name: string;

  constructor(config: { authenticated: boolean; name: string; username?: string; password?: string }) {
    this.authenticated = config.authenticated;
    this.name = config.name;
    this.username = config.username;
    this.password = config.password;
  }

  private async authenticate() {
    let config: AxiosRequestConfig;

    if (this.authenticated) {
      config = { auth: { username: this.username, password: this.password } };
    }

    const { data } = await axios.get(
      'https://auth.docker.io/token?service=registry.docker.io&scope=repository:ratelimitpreview/test:pull',
      config,
    );

    this.token = data.token;
  }

  async getPulls(firstTry = true): Promise<DockerResponse> {
    try {
      const { headers } = await axios.head('https://registry-1.docker.io/v2/ratelimitpreview/test/manifests/latest', {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return {
        limit: Number(headers['ratelimit-limit'].split(';')[0]),
        remaining: Number(headers['ratelimit-remaining'].split(';')[0]),
      };
    } catch (error) {
      if (firstTry) {
        logger.warn('Token expired or never created, try to authenticate');
        await this.authenticate();
        return this.getPulls(false);
      }
      throw error;
    }
  }
}
