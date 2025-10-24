import express from 'express';
import type { Request, Response } from 'express';
import { config } from 'dotenv';
import { setupConversationRoutes } from './routes/conversations.ts';
import { setupMessageRoutes } from './routes/messages.ts';
import { setupMockUtilRoutes } from './routes/mock-utils.ts';
import { seedMockData } from './seed/seed-data.ts';

// Load environment variables from .env file
config();

const app = express();

app.disable('x-powered-by');

// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
const port = Number(process.env['PORT'] ?? 10000);
// biome-ignore lint:useLiteralKeys
const shouldSeed = process.env['SEED_DATA'] === 'true';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req: Request, _res: Response, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
	res.json({
		service: 'Mock Twilio Server',
		status: 'running',
		version: '1.0.0',
		endpoints: {
			conversations: '/v1/Conversations',
			messages: '/v1/Conversations/:conversationSid/Messages',
			mockUtils: '/mock/*',
		},
	});
});

// Setup routes
const router = express.Router();
setupConversationRoutes(router);
setupMessageRoutes(router);
setupMockUtilRoutes(router);

app.use(router);

// 404 handler
app.use((_req: Request, res: Response) => {
	res.status(404).json({
		status: 404,
		message: 'The requested resource was not found',
		code: 20404,
		more_info: 'https://www.twilio.com/docs/errors/20404',
	});
});

// Error handler
app.use((err: Error, _req: Request, res: Response) => {
	console.error('Unhandled error:', err);
	res.status(500).json({
		status: 500,
		message: 'Internal server error',
		error: err.message,
	});
});

// Start server
app.listen(port, () => {
	console.log(`Mock Twilio Server listening on port ${port}`);
	
	if (shouldSeed) {
		seedMockData();
	} else {
		console.log('Starting with empty data store (set SEED_DATA=true to seed)');
	}
});
