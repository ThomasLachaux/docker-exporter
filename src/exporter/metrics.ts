import { Gauge } from 'prom-client';

export const pullLimit = new Gauge({
  name: 'docker_pull_limit',
  help: 'Total allowed pulls in 6 hours',
  labelNames: ['name'],
});

export const pullRemaining = new Gauge({
  name: 'docker_remaining_total',
  help: 'Total remaining pulls in 6 hours',
  labelNames: ['name'],
});
