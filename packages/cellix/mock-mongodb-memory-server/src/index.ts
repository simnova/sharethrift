import { MongoMemoryReplSet } from 'mongodb-memory-server';

import { setupEnvironment } from './setup-environment.js';
import mongoose from 'mongoose';

import { seedDatabase } from './seed/seed.js';

setupEnvironment();
// biome-ignore lint:useLiteralKeys
const port = Number(process.env['PORT'] ?? 50000);
// biome-ignore lint:useLiteralKeys
const dbName = process.env['DB_NAME'] ?? 'test';
// biome-ignore lint:useLiteralKeys
const replSetName = process.env['REPL_SET_NAME'] ?? 'rs0';

console.log('Starting MongoDB Memory Replica Set', {
	port,
	dbName,
	replSetName,
});

await MongoMemoryReplSet.create({
	binary: { version: '7.0.14' },
	replSet: {
		name: replSetName,
		count: 1,
		storageEngine: 'wiredTiger',
	},
	instanceOpts: [{ port }],
})
	.then(async (replicaSet) => {
		// Use the correct URI for the 'sharethrift' database
		const uri = replicaSet.getUri('sharethrift');
		console.log('MongoDB Memory Replica Set ready at:', uri);

		try {
			const conn = await mongoose.connect(uri);

			const requiredCollections = [
				'users',
				'listings',
				'reservationRequests',
				'conversations',
			];
			while (true) {
				const { db } = conn.connection;
				if (!db) {
					throw new Error('Mongoose connection has no db instance');
				}
				const collections = (await db.listCollections().toArray()).map(
					(c) => c.name,
				);
				if (requiredCollections.every((name) => collections.includes(name))) {
					break;
				}
				await new Promise((res) => setTimeout(res, 200));
			}
			console.log('All required collections exist, begin seeding.');
			await seedDatabase(conn.connection);
			console.log('Seeding complete.');
		} catch (err) {
			console.error('Seeding failed:', err);
			process.exit(1);
		}
	})
	.catch((err) => {
		console.error('Error starting MongoDB Memory Replica Set:', err);
		process.exit(1);
	});
