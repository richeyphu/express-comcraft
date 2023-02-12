import os from 'os';
import moment from 'moment';
import { Express, Request, Response, NextFunction } from 'express';

import { env } from '@config';
import type MyPackageJson from '@/package.json';

interface RequestStats {
  total: number;
  last_minute: number;
  last_5mn_avg: number;
  last_15mn_avg: number;
}
interface ServerInfo {
  status: 'up' | 'down';
  name: string | null;
  version: string | null;
  started_at: string;
  uptime: number;
  uptime_human: string;
  requests: RequestStats;
  env: string | null;
}

interface NodeInfo {
  version: string;
  memoryUsage: MemoryInfo;
  uptime: number;
}

interface SystemInfo {
  loadavg: number[];
  freeMemory: MemoryInfo;
  hostname: string;
  os: string;
}

interface MemoryInfo {
  value: number;
  unit: 'MiB';
}

interface ServerStatus {
  server: ServerInfo;
  node: NodeInfo;
  system: SystemInfo;
}

interface RequestWithServerStatus extends Request {
  stats?: {
    start: Date;
    end: Date;
    responseTime: number;
  };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface ResponseWithServerStatus extends Omit<Response, 'end'> {
  end: (...args: never[]) => void;
}

const requests = { total: 0 } as RequestStats;
const requests_per_minute: number[] = Array<number>(60).fill(0);

const uptime_start = new Date();

const sum = (arr: number[], from: number, length: number): number => {
  let total = 0;
  for (let i = from - length; i < from; i++) {
    total += arr[(i + arr.length) % arr.length];
  }
  return total;
};

const average = (arr: number[], from: number, length: number): number => {
  const total = sum(arr, from, length);
  return Math.round(total / arr.length);
};

const resetCounter = (): void => {
  const minute = new Date().getMinutes();
  requests_per_minute[(minute + 1) % 59] = 0;
};
// Every minute, we reset the oldest entry
setInterval(resetCounter, 60 * 1000);

const serverStatus = (app: Express) => {
  const server = { status: 'up' } as ServerInfo;

  const filepath = 'package.json';

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(filepath) as typeof MyPackageJson;
    server.name = pkg.name ?? null;
    server.version = pkg.version ?? null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('express-server-status> Error loading ' + filepath, e);
  }

  app.get('*', (req: Request, res: Response, next: NextFunction): void => {
    requests.total++;
    const minute = new Date().getMinutes();
    requests_per_minute[minute]++;
    return next();
  });

  const response = (
    req: RequestWithServerStatus,
    res: ResponseWithServerStatus,
    next: NextFunction
  ): void => {
    req.stats = {} as RequestWithServerStatus['stats'];
    if (req.stats) req.stats.start = new Date();

    // decorate response `end` method from express
    const end = res.end;
    res.end = (...args): void => {
      if (req.stats) {
        req.stats.responseTime =
          new Date().getTime() - req.stats.start.getTime();
        // call to original express `res.end()` method
        res.setHeader('X-Response-Time', req.stats.responseTime);
      }
      end.apply(res, args);
    };

    const minute = new Date().getMinutes();
    server.started_at = moment(uptime_start).toDate() as unknown as string;
    server.uptime = Math.round(
      (new Date().getTime() - uptime_start.getTime()) / 1000
    );
    server.uptime_human = moment(uptime_start).fromNow() as unknown as string;
    server.env = env.NODE_ENV;

    const node: NodeInfo = {
      version: process.version,
      memoryUsage: {
        value: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: 'MiB',
      },
      uptime: process.uptime(),
    };
    const system: SystemInfo = {
      loadavg: os.loadavg(),
      freeMemory: {
        value: Math.round(os.freemem() / 1024 / 1024),
        unit: 'MiB',
      },
      hostname: os.hostname(),
      os: os.platform(),
    };

    // requests.per_minute = requests_per_minute;
    requests.last_minute = sum(requests_per_minute, minute, 1);
    requests.last_5mn_avg = sum(requests_per_minute, minute, 5);
    requests.last_15mn_avg = average(requests_per_minute, 0, 15);
    server.requests = requests;
    const status: ServerStatus = { server, node, system };

    res.send(status);
  };

  return response;
};

export default serverStatus;
