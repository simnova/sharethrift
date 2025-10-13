#!/usr/bin/env node

/**
 * Azure vs Mock Cognitive Search Comparison Example
 *
 * This example demonstrates how to use the ServiceCognitiveSearch
 * with both Azure Cognitive Search and Mock implementations.
 *
 * ⚠️  NOTE: This example uses hardcoded sample data.
 * For production-ready database-driven examples, see:
 * - examples/database-driven-search.ts (recommended)
 *
 * Run with different environment configurations to see both modes in action.
 */

import { ServiceCognitiveSearch } from '../src/search-service.js';
import { ItemListingSearchIndexSpec } from '@sthrift/domain';

async function main() {
	console.log('=== Cognitive Search Service Demo ===\n');

	// Initialize the service (will auto-detect implementation)
	const searchService = new ServiceCognitiveSearch();

	try {
		// Start up the service
		await searchService.startUp();

		const indexName = 'item-listing-search-demo';

		console.log('1. Creating search index...');
		await searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);
		console.log('✓ Index created successfully\n');

		console.log('2. Indexing sample documents...');

		// Sample item listing documents
		const sampleDocuments = [
			{
				id: 'item-001',
				title: 'Vintage Leather Jacket',
				description:
					'Beautiful brown leather jacket from the 1980s, excellent condition',
				category: 'clothing',
				location: 'Seattle, WA',
				sharerName: 'John Doe',
				sharerId: 'user-001',
				state: 'available',
				sharingPeriodStart: '2024-01-01T00:00:00Z',
				sharingPeriodEnd: '2024-12-31T23:59:59Z',
				createdAt: '2024-01-01T10:00:00Z',
				updatedAt: '2024-01-01T10:00:00Z',
				images: ['jacket1.jpg', 'jacket2.jpg'],
			},
			{
				id: 'item-002',
				title: 'MacBook Pro 13-inch',
				description: 'MacBook Pro with M1 chip, 16GB RAM, 512GB SSD',
				category: 'electronics',
				location: 'Portland, OR',
				sharerName: 'Jane Smith',
				sharerId: 'user-002',
				state: 'available',
				sharingPeriodStart: '2024-01-15T00:00:00Z',
				sharingPeriodEnd: '2024-06-15T23:59:59Z',
				createdAt: '2024-01-15T14:30:00Z',
				updatedAt: '2024-01-15T14:30:00Z',
				images: ['macbook1.jpg'],
			},
			{
				id: 'item-003',
				title: 'Garden Tools Set',
				description:
					'Complete set of garden tools including shovel, rake, and pruning shears',
				category: 'tools',
				location: 'Vancouver, BC',
				sharerName: 'Bob Johnson',
				sharerId: 'user-003',
				state: 'available',
				sharingPeriodStart: '2024-02-01T00:00:00Z',
				sharingPeriodEnd: '2024-10-31T23:59:59Z',
				createdAt: '2024-02-01T09:15:00Z',
				updatedAt: '2024-02-01T09:15:00Z',
				images: ['tools1.jpg', 'tools2.jpg'],
			},
		];

		// Index each document
		for (const doc of sampleDocuments) {
			await searchService.indexDocument(indexName, doc);
			console.log(`✓ Indexed: ${doc.title}`);
		}
		console.log('');

		console.log('3. Performing search queries...\n');

		// Basic text search
		console.log('--- Basic Text Search: "leather" ---');
		const basicResults = await searchService.search(indexName, 'leather');
		console.log(`Found ${basicResults.count} results:`);
		basicResults.results.forEach((result, index) => {
			console.log(
				`  ${index + 1}. ${result.document.title} (Score: ${result.score?.toFixed(2) || 'N/A'})`,
			);
		});
		console.log('');

		// Filtered search
		console.log('--- Filtered Search: "MacBook" with category filter ---');
		const filteredResults = await searchService.search(indexName, 'MacBook', {
			filter: "category eq 'electronics'",
			top: 10,
		});
		console.log(`Found ${filteredResults.count} results:`);
		filteredResults.results.forEach((result, index) => {
			console.log(
				`  ${index + 1}. ${result.document.title} - ${result.document.category}`,
			);
		});
		console.log('');

		// Faceted search
		console.log('--- Faceted Search: "tools" with category facets ---');
		const facetedResults = await searchService.search(indexName, 'tools', {
			facets: ['category', 'location'],
			top: 5,
		});
		console.log(`Found ${facetedResults.count} results:`);
		facetedResults.results.forEach((result, index) => {
			console.log(`  ${index + 1}. ${result.document.title}`);
		});

		if (
			facetedResults.facets &&
			Object.keys(facetedResults.facets).length > 0
		) {
			console.log('\nFacets:');
			for (const [facetName, facetValues] of Object.entries(
				facetedResults.facets,
			)) {
				console.log(`  ${facetName}:`);
				facetValues.forEach((facet) => {
					console.log(`    - ${facet.value} (${facet.count})`);
				});
			}
		}
		console.log('');

		// Sorted search
		console.log('--- Sorted Search: All items sorted by creation date ---');
		const sortedResults = await searchService.search(indexName, '*', {
			orderBy: ['createdAt desc'],
			top: 10,
		});
		console.log(`Found ${sortedResults.count} results (sorted by date):`);
		sortedResults.results.forEach((result, index) => {
			const doc = result.document;
			console.log(`  ${index + 1}. ${doc.title} - Created: ${doc.createdAt}`);
		});
		console.log('');

		// Check if index exists
		console.log('4. Checking index existence...');
		const indexExists = await searchService.indexExists(indexName);
		console.log(`✓ Index exists: ${indexExists}\n`);

		console.log('5. Cleaning up...');
		// Note: In a real application, you might not want to delete the index
		// await searchService.deleteIndex(indexName);
		// console.log('✓ Index deleted\n');

		console.log('=== Demo completed successfully! ===');
	} catch (error) {
		console.error('Demo failed:', error);
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

1. MOCK MODE (Development):
   USE_MOCK_SEARCH=true
   ENABLE_SEARCH_PERSISTENCE=false

2. AZURE MODE (Production):
   SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
   SEARCH_API_KEY=your-admin-api-key
   USE_AZURE_SEARCH=true

3. AZURE MODE (with Managed Identity):
   SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
   # No API key needed - uses Azure managed identity

4. AUTO-DETECT MODE (Recommended):
   # Set Azure credentials if available, otherwise uses mock
   SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
   SEARCH_API_KEY=your-admin-api-key

=== Running the Demo ===

# Mock mode
USE_MOCK_SEARCH=true node examples/azure-vs-mock-comparison.js

# Azure mode
SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net \\
SEARCH_API_KEY=your-api-key \\
node examples/azure-vs-mock-comparison.js

`);
}

// Show examples if no arguments provided
if (process.argv.length === 2) {
	printEnvironmentExamples();
} else {
	main().catch(console.error);
}
