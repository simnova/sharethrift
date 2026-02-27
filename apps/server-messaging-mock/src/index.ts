import dotenv from 'dotenv';
import {
	startMockMessagingServer,
	type MockMessagingServerConfig,
} from '@cellix/server-messaging-seedwork';
import { seedMockData } from './seed/seed-data.js';

// Setup environment variables
const setupEnvironment = () => {
	console.log('Setting up environment variables');
	dotenv.config();
	dotenv.config({ path: `.env.local`, override: true });
	console.log('Environment variables set up');
};

setupEnvironment();

// biome-ignore lint: using bracket notation for environment variable access
const port = Number(process.env['PORT'] ?? 10000);

const config: MockMessagingServerConfig = {
	port,
	seedData: true,
	seedMockData,
};

startMockMessagingServer(config).catch((err: unknown) => {
	console.error('Failed to start mock messaging server:', err);
	process.exit(1);
});
