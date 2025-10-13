import {
	startMockMongoDB,
	type MongoMemoryServerConfig,
} from '@cellix/mock-mongodb-memory-server-seedwork';
import { setupEnvironment } from './setup-environment.js';
import { seedDatabase } from './seed/seed.js';

setupEnvironment();

const collectionsToSeed = [
	'users',
	'listings',
	'conversations',
	'reservationRequests',
];

// biome-ignore lint:useLiteralKeys
const port = Number(process.env['PORT'] ?? 50000);
// biome-ignore lint:useLiteralKeys
const dbName = process.env['DB_NAME'] ?? 'sharethrift';
// biome-ignore lint:useLiteralKeys
const replSetName = process.env['REPL_SET_NAME'] ?? 'rs0';

const config: MongoMemoryServerConfig = {
	collectionsToSeed,
	seedDatabase,
	port,
	dbName,
	replSetName,
};

startMockMongoDB(config).catch((err: unknown) => {
	console.error('Failed to start mock MongoDB:', err);
	process.exit(1);
});
