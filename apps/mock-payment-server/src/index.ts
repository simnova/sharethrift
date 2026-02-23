import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import {
	startMockPaymentServer,
	type PaymentConfig,
} from '@cellix/mock-payment-server-seedwork';

// Setup environment variables
const setupEnvironment = () => {
	console.log('Setting up environment variables');
	dotenv.config();
	dotenv.config({ path: `.env.local`, override: true });
	console.log('Environment variables set up');
};

setupEnvironment();

// Detect certificate availability to determine protocol and base URL
const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../../../',
);
const certKeyPath = path.join(projectRoot, '.certs/sharethrift.localhost-key.pem');
const certPath = path.join(projectRoot, '.certs/sharethrift.localhost.pem');

// biome-ignore lint:useLiteralKeys
const port = Number(process.env['PORT'] ?? 3001);
const HOST = 'mock-payment.sharethrift.localhost';

const fs = await import('node:fs');
const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

// Derive protocol and base URLs based on cert availability
const PROTOCOL = hasCerts ? 'https' : 'http';
const FRONTEND_HOST = hasCerts ? 'sharethrift.localhost:3000' : 'localhost:3000';
const PAYMENT_HOST = hasCerts ? `${HOST}:${port}` : `localhost:${port}`;

const FRONTEND_BASE_URL = `${PROTOCOL}://${FRONTEND_HOST}`;
const PAYMENT_BASE_URL = `${PROTOCOL}://${PAYMENT_HOST}`;

const config: PaymentConfig = {
	port,
	protocol: PROTOCOL as 'http' | 'https',
	host: hasCerts ? HOST : 'localhost',
	paymentHost: PAYMENT_HOST,
	frontendBaseUrl: FRONTEND_BASE_URL,
	paymentBaseUrl: PAYMENT_BASE_URL,
	...(hasCerts && { certKeyPath, certPath }),
};

startMockPaymentServer(config).catch((err: unknown) => {
	console.error('Failed to start mock payment server:', err);
	process.exit(1);
});
