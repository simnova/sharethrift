import dotenv from 'dotenv';
import {
	startMockPaymentServer,
	type PaymentConfig,
} from '@cellix/server-payment-seedwork';

// Setup environment variables
const setupEnvironment = () => {
	console.log('Setting up environment variables');
	dotenv.config();
	dotenv.config({ path: `.env.local`, override: true });
	console.log('Environment variables set up');
};

setupEnvironment();

// biome-ignore lint:useLiteralKeys
const port = Number(process.env['PORT'] ?? 3001);

const FRONTEND_BASE_URL = process.env['FRONTEND_BASE_URL'] ?? 'https://sharethrift.localhost:1355';
const PAYMENT_BASE_URL = process.env['PAYMENT_BASE_URL'] ?? 'https://mock-payment.sharethrift.localhost:1355';

const config: PaymentConfig = {
	port,
	frontendBaseUrl: FRONTEND_BASE_URL,
	paymentBaseUrl: PAYMENT_BASE_URL,
};

startMockPaymentServer(config).catch((err: unknown) => {
	console.error('Failed to start mock payment server:', err);
	process.exit(1);
});
