import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

// Detect certificate availability to determine protocol
const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../../../',
);
const certKeyPath = path.join(projectRoot, '.certs/sharethrift.localhost-key.pem');
const certPath = path.join(projectRoot, '.certs/sharethrift.localhost.pem');

// biome-ignore lint: using bracket notation for environment variable access
const port = Number(process.env['PORT'] ?? 10000);

const fs = await import('node:fs');
const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

const config: MockMessagingServerConfig = {
	port,
	useHttps: hasCerts,
	seedData: true,
	host: hasCerts ? 'mock-messaging.sharethrift.localhost' : 'localhost',
	certKeyPath,
	certPath,
	seedMockData,
};

startMockMessagingServer(config).catch((err: unknown) => {
	console.error('Failed to start mock messaging server:', err);
	process.exit(1);
});
