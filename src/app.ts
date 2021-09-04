import { Server } from 'node:http';

import cors from 'cors';
import { cleanEnv, port, str, url } from 'envalid';
import express from 'express';
import paginate from 'express-paginate';
import logger from 'express-pino-logger';

import handleRouteNotFound from '@/middleware/routeNotFound';
import handleServerError from '@/middleware/serverError';
import productRoutes from '@/routes/products';
import * as db from '@/utils/db';

const app = express();
const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  PORT: port({ default: 1337 }),
  MONGO_URL: url({ devDefault: 'mongodb://localhost/admin' }),
  LOG_LEVEL: str({
    choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    default: 'info',
  }),
  ALLOWED_ORIGINS: str({
    default: '*',
    example: 'localhost:3000,localhost',
  }),
});

app.use(
  logger({
    level: env.LOG_LEVEL,
    enabled: !env.isTest,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(paginate.middleware(10, 50));
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(/\s*,\s*/),
    exposedHeaders: ['X-Total-Count'],
  }),
);
app.use('/api', [productRoutes]);

app.get('/health', (_, response) => {
  const state = db.status();
  const isUp = state === 'connected';

  response.status(isUp ? 200 : 503).json({
    status: isUp ? 'up' : 'down',
    db: state,
  });
});

app.use(handleRouteNotFound);
app.use(handleServerError);

function handleExceptions(error: unknown) {
  console.error(error);
  process.exitCode = 1;
}

function handleServerExit(signal: string, server: Server) {
  return () => {
    console.info(`${signal} received! shutting down`);
    void db.disconnect();

    server.close(() => {
      process.exitCode = 0;
    });
  };
}

async function bootstrap() {
  await db.connect(env.MONGO_URL);

  const server = app.listen(env.PORT, () => {
    console.log(`Listening at http://localhost:${env.PORT}`);
  });

  server.on('error', handleExceptions);

  process.on('unhandledRejection', handleExceptions);
  process.on('uncaughtException', handleExceptions);
  process.on('SIGINT', handleServerExit('SIGINT', server));
  process.on('SIGTERM', handleServerExit('SIGTERM', server));
}

if (require.main === module) {
  void bootstrap();
}

export default app;
