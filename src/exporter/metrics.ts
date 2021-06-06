import { Gauge } from 'prom-client';
import env from '../utils/env';
import Docker from './docker';

const pullLimit = new Gauge({
  name: 'docker_pull_limit',
  help: 'Total allowed pulls in 6 hours',
  labelNames: ['name'],
});

const pullRemaining = new Gauge({
  name: 'docker_remaining_total',
  help: 'Total remaining pulls in 6 hours',
  labelNames: ['name'],
});

const dockers = env.docker.configs.map((config) => new Docker(config));
export const collectMetrics = () =>
  dockers.map(async (docker) => {
    const pulls = await docker.getPulls();

    pullLimit.labels(docker.name).set(pulls.limit);
    pullRemaining.labels(docker.name).set(pulls.remaining);
  });
