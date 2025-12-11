/**
 * LiQE Advanced Filtering Examples
 * 
 * This file demonstrates the advanced OData-style filtering capabilities
 * provided by the LiQE integration in the mock cognitive search service.
 * 
 * @fileoverview Comprehensive examples of LiQE filtering features
 * @author ShareThrift Development Team
 * @since 1.0.0
 */

import { InMemoryCognitiveSearch } from '../src/index.js';

/**
 * Sample data for demonstration
 */
const sampleListings = [
  {
    id: '1',
    title: 'Mountain Bike Adventure',
    description: 'High-quality mountain bike perfect for trail riding and outdoor adventures',
    category: 'Sports',
    price: 500,
    brand: 'Trek',
    isActive: true,
    tags: ['outdoor', 'fitness', 'adventure']
  },
  {
    id: '2',
    title: 'Road Bike Commuter',
    description: 'Lightweight road bike ideal for daily commuting and city rides',
    category: 'Urban',
    price: 300,
    brand: 'Giant',
    isActive: true,
    tags: ['commuting', 'city', 'lightweight']
  },
  {
    id: '3',
    title: 'Electric Scooter',
    description: 'Modern electric scooter for urban transportation',
    category: 'Urban',
    price: 800,
    brand: 'Xiaomi',
    isActive: false,
    tags: ['electric', 'urban', 'transport']
  },
  {
    id: '4',
    title: 'Mountain Bike Trail',
    description: 'Professional mountain bike designed for challenging trails',
    category: 'Sports',
    price: 1200,
    brand: 'Specialized',
    isActive: true,
    tags: ['trail', 'professional', 'challenging']
  },
  {
    id: '5',
    title: 'City Bike Classic',
    description: 'Classic city bike for leisurely rides around town',
    category: 'Urban',
    price: 250,
    brand: 'Schwinn',
    isActive: true,
    tags: ['classic', 'leisurely', 'city']
  }
];

/**
 * Initialize the search service with sample data
 */
async function initializeSearchService(): Promise<InMemoryCognitiveSearch> {
  const searchService = new InMemoryCognitiveSearch();
  await searchService.startup();

  // Create the item listings index
  await searchService.createIndexIfNotExists({
    name: 'item-listings',
    fields: [
      { name: 'id', type: 'Edm.String', key: true, retrievable: true },
      { name: 'title', type: 'Edm.String', searchable: true, filterable: true },
      { name: 'description', type: 'Edm.String', searchable: true },
      { name: 'category', type: 'Edm.String', filterable: true, facetable: true },
      { name: 'price', type: 'Edm.Double', filterable: true, sortable: true },
      { name: 'brand', type: 'Edm.String', filterable: true, facetable: true },
      { name: 'isActive', type: 'Edm.Boolean', filterable: true, facetable: true },
      { name: 'tags', type: 'Collection(Edm.String)', filterable: true, facetable: true }
    ]
  });

  // Index all sample documents
  for (const listing of sampleListings) {
    await searchService.indexDocument('item-listings', listing);
  }

  return searchService;
}

/**
 * Example 1: Basic Comparison Operators
 */
export async function basicComparisonExamples() {
  console.log('\n=== Basic Comparison Operators ===');
  
  const searchService = await initializeSearchService();

  // Equality
  console.log('\n1. Equality (eq):');
  const equalityResults = await searchService.search('item-listings', '', {
    filter: "category eq 'Sports'"
  });
  console.log(`Found ${equalityResults.count} items in Sports category`);

  // Inequality
  console.log('\n2. Inequality (ne):');
  const inequalityResults = await searchService.search('item-listings', '', {
    filter: "price ne 500"
  });
  console.log(`Found ${inequalityResults.count} items not priced at $500`);

  // Greater than
  console.log('\n3. Greater than (gt):');
  const greaterThanResults = await searchService.search('item-listings', '', {
    filter: "price gt 400"
  });
  console.log(`Found ${greaterThanResults.count} items priced above $400`);

  // Less than or equal
  console.log('\n4. Less than or equal (le):');
  const lessEqualResults = await searchService.search('item-listings', '', {
    filter: "price le 300"
  });
  console.log(`Found ${lessEqualResults.count} items priced at $300 or below`);

  await searchService.shutdown();
}

/**
 * Example 2: String Functions
 */
export async function stringFunctionExamples() {
  console.log('\n=== String Functions ===');
  
  const searchService = await initializeSearchService();

  // Contains function
  console.log('\n1. Contains function:');
  const containsResults = await searchService.search('item-listings', '', {
    filter: "contains(title, 'Bike')"
  });
  console.log(`Found ${containsResults.count} items with 'Bike' in title`);
  containsResults.results.forEach(r => console.log(`  - ${r.document.title}`));

  // Starts with function
  console.log('\n2. Starts with function:');
  const startsWithResults = await searchService.search('item-listings', '', {
    filter: "startswith(title, 'Mountain')"
  });
  console.log(`Found ${startsWithResults.count} items starting with 'Mountain'`);
  startsWithResults.results.forEach(r => console.log(`  - ${r.document.title}`));

  // Ends with function
  console.log('\n3. Ends with function:');
  const endsWithResults = await searchService.search('item-listings', '', {
    filter: "endswith(title, 'Bike')"
  });
  console.log(`Found ${endsWithResults.count} items ending with 'Bike'`);
  endsWithResults.results.forEach(r => console.log(`  - ${r.document.title}`));

  await searchService.shutdown();
}

/**
 * Example 3: Logical Operators
 */
export async function logicalOperatorExamples() {
  console.log('\n=== Logical Operators ===');
  
  const searchService = await initializeSearchService();

  // AND operator
  console.log('\n1. AND operator:');
  const andResults = await searchService.search('item-listings', '', {
    filter: "category eq 'Sports' and price gt 400"
  });
  console.log(`Found ${andResults.count} Sports items priced above $400`);
  andResults.results.forEach(r => console.log(`  - ${r.document.title} ($${r.document.price})`));

  // OR operator
  console.log('\n2. OR operator:');
  const orResults = await searchService.search('item-listings', '', {
    filter: "brand eq 'Trek' or brand eq 'Specialized'"
  });
  console.log(`Found ${orResults.count} items from Trek or Specialized`);
  orResults.results.forEach(r => console.log(`  - ${r.document.title} (${r.document.brand})`));

  // Complex nested expression
  console.log('\n3. Complex nested expression:');
  const complexResults = await searchService.search('item-listings', '', {
    filter: "(category eq 'Sports' or category eq 'Urban') and price le 1000 and isActive eq true"
  });
  console.log(`Found ${complexResults.count} active Sports or Urban items under $1000`);
  complexResults.results.forEach(r => console.log(`  - ${r.document.title} (${r.document.category}, $${r.document.price})`));

  await searchService.shutdown();
}

/**
 * Example 4: Combined Search and Filtering
 */
export async function combinedSearchExamples() {
  console.log('\n=== Combined Search and Filtering ===');
  
  const searchService = await initializeSearchService();

  // Full-text search with filters
  console.log('\n1. Full-text search with filters:');
  const combinedResults = await searchService.search('item-listings', 'bike', {
    filter: "contains(title, 'Mountain') and price gt 300",
    facets: ['category', 'brand'],
    top: 10,
    includeTotalCount: true
  });
  console.log(`Found ${combinedResults.count} results for 'bike' with Mountain in title and price > $300`);
  combinedResults.results.forEach(r => console.log(`  - ${r.document.title} ($${r.document.price})`));

  // Facets with filtering
  console.log('\n2. Facets with filtering:');
  if (combinedResults.facets) {
    console.log('Category facets:', combinedResults.facets.category);
    console.log('Brand facets:', combinedResults.facets.brand);
  }

  await searchService.shutdown();
}

/**
 * Example 5: Advanced Filtering Scenarios
 */
export async function advancedFilteringExamples() {
  console.log('\n=== Advanced Filtering Scenarios ===');
  
  const searchService = await initializeSearchService();

  // Price range filtering
  console.log('\n1. Price range filtering:');
  const priceRangeResults = await searchService.search('item-listings', '', {
    filter: "price ge 250 and price le 800"
  });
  console.log(`Found ${priceRangeResults.count} items in price range $250-$800`);
  priceRangeResults.results.forEach(r => console.log(`  - ${r.document.title} ($${r.document.price})`));

  // Active items only with specific criteria
  console.log('\n2. Active items with specific criteria:');
  const activeResults = await searchService.search('item-listings', '', {
    filter: "isActive eq true and (contains(title, 'Bike') or contains(title, 'Scooter'))"
  });
  console.log(`Found ${activeResults.count} active bikes or scooters`);
  activeResults.results.forEach(r => console.log(`  - ${r.document.title} (${r.document.category})`));

  // Brand and category combination
  console.log('\n3. Brand and category combination:');
  const brandCategoryResults = await searchService.search('item-listings', '', {
    filter: "brand ne 'Xiaomi' and category eq 'Sports'"
  });
  console.log(`Found ${brandCategoryResults.count} Sports items not from Xiaomi`);
  brandCategoryResults.results.forEach(r => console.log(`  - ${r.document.title} (${r.document.brand})`));

  await searchService.shutdown();
}

/**
 * Example 6: Filter Capabilities and Validation
 */
export async function filterCapabilitiesExamples() {
  console.log('\n=== Filter Capabilities and Validation ===');
  
  const searchService = await initializeSearchService();

  // Check filter capabilities
  console.log('\n1. Filter capabilities:');
  const capabilities = searchService.getFilterCapabilities();
  console.log('Supported features:', capabilities.supportedFeatures);

  // Validate filter syntax
  console.log('\n2. Filter validation:');
  const validFilters = [
    "price gt 100",
    "category eq 'Sports'",
    "contains(title, 'Bike')",
    "(category eq 'Sports' or category eq 'Urban') and price le 1000"
  ];

  const invalidFilters = [
    "malformed filter",
    "invalid syntax here",
    "unknown operator test"
  ];

  validFilters.forEach(filter => {
    const isValid = capabilities.isFilterSupported(filter);
    console.log(`  "${filter}" is ${isValid ? 'valid' : 'invalid'}`);
  });

  invalidFilters.forEach(filter => {
    const isValid = capabilities.isFilterSupported(filter);
    console.log(`  "${filter}" is ${isValid ? 'valid' : 'invalid'}`);
  });

  await searchService.shutdown();
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Running LiQE Advanced Filtering Examples');
  console.log('==========================================');

  try {
    await basicComparisonExamples();
    await stringFunctionExamples();
    await logicalOperatorExamples();
    await combinedSearchExamples();
    await advancedFilteringExamples();
    await filterCapabilitiesExamples();

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    throw error;
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
