#!/usr/bin/env node

/**
 * Database-Driven Cognitive Search Example
 *
 * This example demonstrates how to use the ServiceCognitiveSearch
 * with data from the MongoDB database instead of hardcoded samples.
 * It shows the proper integration with the mock-mongodb-memory-server
 * seeded data.
 */

import { ServiceCognitiveSearch } from '../src/search-service.js';
import {
	ItemListingSearchIndexSpec,
	convertItemListingToSearchDocument,
} from '@sthrift/domain';
import { MongoClient } from 'mongodb';

// Configuration
const MONGODB_URI =
	process.env['COSMOSDB_CONNECTION_STRING'] ||
	'mongodb://localhost:50000/test?replicaSet=rs0';
const SEARCH_INDEX_NAME = 'item-listings';

/**
 * Fetches item listings from the database and converts them to search documents
 */
async function fetchItemListingsFromDatabase(): Promise<
	Record<string, unknown>[]
> {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('✓ Connected to MongoDB');

		const db = client.db();
		const itemListings = await db.collection('itemlistings').find({}).toArray();

		console.log(`✓ Fetched ${itemListings.length} item listings from database`);
		return itemListings;
	} catch (error) {
		console.error('Error fetching item listings from database:', error);
		throw error;
	} finally {
		await client.close();
	}
}

/**
 * Fetches users from the database for reference
 */
async function fetchUsersFromDatabase(): Promise<Record<string, unknown>[]> {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		const db = client.db();
		const users = await db.collection('users').find({}).toArray();

		console.log(`✓ Fetched ${users.length} users from database`);
		return users;
	} catch (error) {
		console.error('Error fetching users from database:', error);
		throw error;
	} finally {
		await client.close();
	}
}

async function main() {
	console.log('=== Database-Driven Cognitive Search Demo ===\n');

	// Initialize the search service
	const searchService = new ServiceCognitiveSearch();

	try {
		// Start up the service
		await searchService.startUp();

		console.log('1. Creating search index...');
		await searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);
		console.log('✓ Index created successfully\n');

		console.log('2. Fetching data from database...');

		// Fetch users and item listings from database
		const [users, itemListings] = await Promise.all([
			fetchUsersFromDatabase(),
			fetchItemListingsFromDatabase(),
		]);

		if (itemListings.length === 0) {
			console.log(
				'⚠️  No item listings found in database. Make sure the mock-mongodb-memory-server is running with SEED_MOCK_DATA=true',
			);
			return;
		}

		console.log('3. Indexing database documents...');

		// Index each item listing from the database
		for (const itemListing of itemListings) {
			// Convert the database document to search document format
			const searchDocument = convertItemListingToSearchDocument(itemListing);

			await searchService.indexDocument(SEARCH_INDEX_NAME, searchDocument);
			console.log(`✓ Indexed: ${itemListing.title} (ID: ${itemListing._id})`);
		}
		console.log('');

		console.log('4. Performing search queries on database data...\n');

		// Basic text search
		console.log('--- Text Search: "bike" ---');
		const bikeResults = await searchService.search(SEARCH_INDEX_NAME, 'bike');
		console.log(`Found ${bikeResults.count} results:`);
		bikeResults.results.forEach((result, index) => {
			console.log(
				`  ${index + 1}. ${result.document.title} - ${result.document.location}`,
			);
		});
		console.log('');

		// Search by category
		console.log('--- Category Filter: "Tools & Equipment" ---');
		const toolsResults = await searchService.search(SEARCH_INDEX_NAME, '*', {
			filter: "category eq 'Tools & Equipment'",
			top: 10,
		});
		console.log(`Found ${toolsResults.count} results:`);
		toolsResults.results.forEach((result, index) => {
			console.log(
				`  ${index + 1}. ${result.document.title} - ${result.document.description}`,
			);
		});
		console.log('');

		// Search by location
		console.log('--- Location Filter: "Philadelphia" ---');
		const locationResults = await searchService.search(SEARCH_INDEX_NAME, '*', {
			filter: "location eq 'Philadelphia, PA'",
			top: 10,
		});
		console.log(`Found ${locationResults.count} results:`);
		locationResults.results.forEach((result, index) => {
			console.log(
				`  ${index + 1}. ${result.document.title} - ${result.document.category}`,
			);
		});
		console.log('');

		// Search with multiple criteria
		console.log('--- Multi-criteria Search: "tools" in "Vancouver" ---');
		const multiResults = await searchService.search(
			SEARCH_INDEX_NAME,
			'tools',
			{
				filter: "location eq 'Vancouver, BC'",
				top: 5,
			},
		);
		console.log(`Found ${multiResults.count} results:`);
		multiResults.results.forEach((result, index) => {
			console.log(
				`  ${index + 1}. ${result.document.title} - ${result.document.location}`,
			);
		});
		console.log('');

		// Sorted search by creation date
		console.log('--- Sorted Search: All items by creation date ---');
		const sortedResults = await searchService.search(SEARCH_INDEX_NAME, '*', {
			orderBy: ['createdAt desc'],
			top: 10,
		});
		console.log(`Found ${sortedResults.count} results (sorted by date):`);
		sortedResults.results.forEach((result, index) => {
			const doc = result.document;
			console.log(`  ${index + 1}. ${doc.title} - Created: ${doc.createdAt}`);
		});
		console.log('');

		// Show data relationships
		console.log('5. Demonstrating data relationships...');
		console.log('Database connections:');
		console.log(`- Users: ${users.length} total`);
		console.log(`- Item Listings: ${itemListings.length} total`);

		// Show which users have listings
		const usersWithListings = new Set(
			itemListings.map((listing) => listing.sharer),
		);
		console.log(`- Users with listings: ${usersWithListings.size}`);

		// Show category distribution
		const categories = [
			...new Set(itemListings.map((listing) => listing.category)),
		];
		console.log(`- Categories: ${categories.join(', ')}`);

		// Show location distribution
		const locations = [
			...new Set(itemListings.map((listing) => listing.location)),
		];
		console.log(`- Locations: ${locations.join(', ')}`);
		console.log('');

		console.log('6. Checking index status...');
		const indexExists = await searchService.indexExists(SEARCH_INDEX_NAME);
		console.log(`✓ Index exists: ${indexExists}`);
		console.log(`✓ Indexed documents: ${itemListings.length}`);
		console.log('');

		console.log('=== Database-Driven Demo completed successfully! ===');
		console.log('\nKey Benefits Demonstrated:');
		console.log('✓ Real database integration (no hardcoded data)');
		console.log('✓ Connected data relationships (users ↔ item listings)');
		console.log('✓ Consistent data structure across the application');
		console.log('✓ GraphQL-compatible data format');
		console.log('✓ Production-ready search functionality');
	} catch (error) {
		console.error('Demo failed:', error);
		console.log('\nTroubleshooting:');
		console.log(
			'1. Make sure MongoDB Memory Server is running: npm run start-emulator:mongo-memory-server',
		);
		console.log('2. Check that SEED_MOCK_DATA=true in the memory server');
		console.log('3. Verify COSMOSDB_CONNECTION_STRING environment variable');
	} finally {
		// Always shut down the service
		await searchService.shutDown();
	}
}

// Environment configuration examples
function printEnvironmentExamples() {
	console.log(`
=== Environment Configuration Examples ===

To run this demo with different implementations, set these environment variables:

1. DATABASE CONNECTION:
   COSMOSDB_CONNECTION_STRING=mongodb://localhost:50000/test?replicaSet=rs0
   
2. SEARCH IMPLEMENTATION:
   # For mock search (development)
   USE_MOCK_SEARCH=true
   
   # For Azure search (production)
   SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
   SEARCH_API_KEY=your-admin-api-key

=== Prerequisites ===

1. Start the MongoDB Memory Server with mock data:
   npm run start-emulator:mongo-memory-server

2. Verify the server is seeding data:
   # Should see: "✓ Seeded X users" and "✓ Seeded Y item listings"

=== Running the Demo ===

# Database-driven mock search
USE_MOCK_SEARCH=true node examples/database-driven-search.js

# Database-driven Azure search
SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net \\
SEARCH_API_KEY=your-api-key \\
node examples/database-driven-search.js

`);
}

// Show examples if no arguments provided
if (process.argv.length === 2) {
	printEnvironmentExamples();
} else {
	main().catch(console.error);
}
