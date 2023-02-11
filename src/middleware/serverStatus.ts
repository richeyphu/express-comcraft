import path from 'path';
import os from 'os';
import fs from 'fs';
import moment, { Moment } from 'moment';
import { Express, Request, Response, NextFunction } from 'express';

import type MyPackageJson from '@/package.json';

interface RequestStats {
  total: number;
  last_minute: number;
  last_5mn_avg: number;
  last_15mn_avg: number;
}
interface ServerInfo {
  status: 'up' | 'down';
  name: string;
  version: string;
  started_at: Moment;
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

interface ServerStatusRequest extends Request {
  stats: {
    start: Date;
    end: Date;
    responseTime: number;
  };
}

const requests = { total: 0 } as RequestStats;
const requests_per_minute: number[] = [];

for (let i = 0; i < 60; i++) requests_per_minute[i] = 0;

const uptime_start = new Date();
// const exec = require('child_process').exec;
// const git_data = {};
// exec(__dirname + '/lib/get_git_data.sh', function (err, res, stderr) {
//   const cols = res.trim().split(',');
//   git_data.branch = cols[0];
//   git_data.sha = cols[1] && cols[1].substr(0, 7);
// });

const sum = function (arr: number[], from: number, length: number) {
  let total = 0;
  for (let i = from - length; i < from; i++) {
    total += arr[(i + arr.length) % arr.length];
  }
  return total;
};

const average = function (arr: number[], from: number, length: number) {
  const total = sum(arr, from, length);
  return Math.round(total / arr.length);
};

const resetCounter = function () {
  const minute = new Date().getMinutes();
  requests_per_minute[(minute + 1) % 59] = 0;
};
// Every minute, we reset the oldest entry
setInterval(resetCounter, 60 * 1000);

const serverStatus = function (app: Express) {
  const server = { status: 'up' } as ServerInfo;

  const filepath = 'package.json';

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(filepath) as typeof MyPackageJson;
    server.name = pkg.name;
    server.version = pkg.version;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('express-server-status> Error loading ' + filepath, e);
  }

  app.get('*', function (req: Request, res: Response, next: NextFunction) {
    requests.total++;
    const minute = new Date().getMinutes();
    requests_per_minute[minute]++;
    return next();
  });

  return function (req: any, res: any, next: any) {
    req.stats = {} as ServerStatusRequest['stats'];
    req.stats.start = new Date();

    // decorate response#end method from express
    const end = res.end;
    res.end = function () {
      req.stats.responseTime = new Date().getTime() - req.stats.start;
      // call to original express#res.end()
      res.setHeader('X-Response-Time', req.stats.responseTime);
      end.apply(res, arguments);
    };

    const minute = new Date().getMinutes();
    server.started_at = moment(uptime_start);
    server.uptime = Math.round(
      (new Date().getTime() - uptime_start.getTime()) / 1000
    );
    server.uptime_human = moment(uptime_start).fromNow();
    server.env = process.env.NODE_ENV || null;

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
};

export default serverStatus;
