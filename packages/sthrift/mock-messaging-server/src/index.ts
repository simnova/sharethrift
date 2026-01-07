import express from 'express';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response, Application } from 'express';
import type { Server } from 'node:http';
import { config } from 'dotenv';
import { setupConversationRoutes } from './routes/conversations.ts';
import { setupMessageRoutes } from './routes/messages.ts';
import { setupParticipantRoutes } from './routes/participants.ts';
import { setupMockUtilRoutes } from './routes/mock-utils.ts';
import { seedMockData } from './seed/seed-data.ts';

config();

export function createApp(): Application {
	const app = express();

	app.disable('x-powered-by');

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use((req: Request, _res: Response, next) => {
		console.log(`${req.method} ${req.path}`);
		next();
	});

	app.get('/', (_req: Request, res: Response) => {
		res.json({
			service: 'Mock Twilio Server',
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

export function startServer(port = 10000, seedData = false): Promise<Server> {
	return new Promise((resolve) => {
		const app = createApp();
		
		// From package directory, go up 3 levels to workspace root
		// packages/sthrift/mock-messaging-server -> ../../..
		const workspaceRoot = path.join(process.cwd(), '../../../');
		
		const httpsOptions = {
			key: fs.readFileSync(
				path.join(workspaceRoot, '.certs/sharethrift.localhost-key.pem'),
			),
			cert: fs.readFileSync(
				path.join(workspaceRoot, '.certs/sharethrift.localhost.pem'),
			),
		};
		
		const server = https.createServer(httpsOptions, app).listen(port, 'mock-messaging.sharethrift.localhost', () => {
			console.log(` Mock Messaging Server listening on https://mock-messaging.sharethrift.localhost:${port}`);
			
			if (seedData) {
				seedMockData();
			} else {
				console.log('Starting with empty data store (set seedData=true to seed)');
			}
			
			resolve(server);
		});
	});
}

export function stopServer(server: Server): Promise<void> {
	return new Promise((resolve, reject) => {
		server.close((err) => {
			if (err) {
				reject(err);
			} else {
				console.log('Mock Twilio Server stopped');
				resolve();
			}
		});
	});
}

// Start server when run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
	// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
	const port = Number(process.env['PORT'] ?? 10000);
	// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
	const shouldSeed = process.env['SEED_DATA'] === 'true';
	
	startServer(port, shouldSeed);
}
