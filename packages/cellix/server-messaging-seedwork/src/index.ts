import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import * as http from 'node:http';
import { config as dotenvConfig } from 'dotenv';
import { setupConversationRoutes } from './routes/conversations.js';
import { setupMessageRoutes } from './routes/messages.js';
import { setupParticipantRoutes } from './routes/participants.js';
import { setupMockUtilRoutes } from './routes/mock-utils.js';
import type { Server } from 'node:http';

export interface MockMessagingServerConfig {
  port: number;
  seedData: boolean;
  seedMockData?: () => void;
  host?: string;
  env?: NodeJS.ProcessEnv;
}

dotenvConfig();

export function createMockMessagingApp(): Application {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      service: 'Mock Messaging Server',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        conversations: '/v1/Conversations',
        messages: '/v1/Conversations/:conversationSid/Messages',
        participants: '/v1/Conversations/:conversationSid/Participants',
        mockUtils: '/mock/*',
      },
    });
  });
  const router = express.Router();
  setupConversationRoutes(router);
  setupMessageRoutes(router);
  setupParticipantRoutes(router);
  setupMockUtilRoutes(router);
  app.use(router);
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: 'The requested resource was not found',
      code: 20404,
      more_info: 'https://www.twilio.com/docs/errors/20404',
    });
  });
  app.use((err: Error, _req: Request, res: Response) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: err.message,
    });
  });
  return app;
}

export function startMockMessagingServer(config: MockMessagingServerConfig): Promise<Server> {
  const app = createMockMessagingApp();
  return new Promise((resolve) => {
    // HTTP server — portless handles TLS/proxy at the subdomain level
    const server = http.createServer(app).listen(config.port, () => {
      console.log(` Mock Messaging Server listening on http://localhost:${config.port}`);
      if (config.seedData && config.seedMockData) {
        config.seedMockData();
      } else {
        console.log('Starting with empty data store (set seedData=true to seed)');
      }
      resolve(server);
    });
  });
}

export function stopMockMessagingServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Mock Messaging Server stopped');
        resolve();
      }
    });
  });
}
