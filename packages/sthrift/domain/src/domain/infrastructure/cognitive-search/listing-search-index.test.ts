/**
 * Tests for Listing Search Index Definition
 *
 * Tests the search index schema and document conversion logic
 * for the Listing search functionality.
 */

import { describe, expect, it } from 'vitest';
import {
	ListingSearchIndexSpec,
	convertListingToSearchDocument,
} from './listing-search-index.js';

describe('ListingSearchIndexSpec', () => {
	it('should have correct index name', () => {
		expect(ListingSearchIndexSpec.name).toBe('listings');
	});

	it('should define all required fields', () => {
		const fieldNames = ListingSearchIndexSpec.fields.map((f) => f.name);

		expect(fieldNames).toContain('id');
		expect(fieldNames).toContain('title');
		expect(fieldNames).toContain('description');
		expect(fieldNames).toContain('location');
		expect(fieldNames).toContain('category');
		expect(fieldNames).toContain('state');
		expect(fieldNames).toContain('sharerName');
		expect(fieldNames).toContain('sharerId');
		expect(fieldNames).toContain('sharingPeriodStart');
		expect(fieldNames).toContain('sharingPeriodEnd');
		expect(fieldNames).toContain('createdAt');
		expect(fieldNames).toContain('updatedAt');
		expect(fieldNames).toContain('images');
	});

	it('should have correct field count', () => {
		expect(ListingSearchIndexSpec.fields).toHaveLength(13);
	});

	describe('id field', () => {
		const idField = ListingSearchIndexSpec.fields.find((f) => f.name === 'id');

		it('should be defined', () => {
			expect(idField).toBeDefined();
		});

		it('should be the key field', () => {
			expect(idField?.key).toBe(true);
		});

		it('should be of type Edm.String', () => {
			expect(idField?.type).toBe('Edm.String');
		});

		it('should not be searchable', () => {
			expect(idField?.searchable).toBe(false);
		});

		it('should be filterable', () => {
			expect(idField?.filterable).toBe(true);
		});

		it('should be retrievable', () => {
			expect(idField?.retrievable).toBe(true);
		});
	});

	describe('title field', () => {
		const titleField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'title',
		);

		it('should be defined', () => {
			expect(titleField).toBeDefined();
		});

		it('should be searchable', () => {
			expect(titleField?.searchable).toBe(true);
		});

		it('should be sortable', () => {
			expect(titleField?.sortable).toBe(true);
		});

		it('should be retrievable', () => {
			expect(titleField?.retrievable).toBe(true);
		});

		it('should not be filterable', () => {
			expect(titleField?.filterable).toBe(false);
		});
	});

	describe('description field', () => {
		const descField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'description',
		);

		it('should be defined', () => {
			expect(descField).toBeDefined();
		});

		it('should be searchable', () => {
			expect(descField?.searchable).toBe(true);
		});

		it('should be retrievable', () => {
			expect(descField?.retrievable).toBe(true);
		});

		it('should not be sortable', () => {
			expect(descField?.sortable).toBe(false);
		});
	});

	describe('location field', () => {
		const locationField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'location',
		);

		it('should be defined', () => {
			expect(locationField).toBeDefined();
		});

		it('should be searchable', () => {
			expect(locationField?.searchable).toBe(true);
		});

		it('should be filterable', () => {
			expect(locationField?.filterable).toBe(true);
		});

		it('should be retrievable', () => {
			expect(locationField?.retrievable).toBe(true);
		});
	});

	describe('category field', () => {
		const categoryField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'category',
		);

		it('should be defined', () => {
			expect(categoryField).toBeDefined();
		});

		it('should be filterable', () => {
			expect(categoryField?.filterable).toBe(true);
		});

		it('should be facetable', () => {
			expect(categoryField?.facetable).toBe(true);
		});

		it('should be sortable', () => {
			expect(categoryField?.sortable).toBe(true);
		});

		it('should not be searchable', () => {
			expect(categoryField?.searchable).toBe(false);
		});
	});

	describe('state field', () => {
		const stateField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'state',
		);

		it('should be defined', () => {
			expect(stateField).toBeDefined();
		});

		it('should be filterable', () => {
			expect(stateField?.filterable).toBe(true);
		});

		it('should be facetable', () => {
			expect(stateField?.facetable).toBe(true);
		});

		it('should be sortable', () => {
			expect(stateField?.sortable).toBe(true);
		});
	});

	describe('sharer fields', () => {
		const sharerNameField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'sharerName',
		);
		const sharerIdField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'sharerId',
		);

		it('should have sharerName field', () => {
			expect(sharerNameField).toBeDefined();
		});

		it('sharerName should be searchable', () => {
			expect(sharerNameField?.searchable).toBe(true);
		});

		it('sharerName should be sortable', () => {
			expect(sharerNameField?.sortable).toBe(true);
		});

		it('should have sharerId field', () => {
			expect(sharerIdField).toBeDefined();
		});

		it('sharerId should be filterable', () => {
			expect(sharerIdField?.filterable).toBe(true);
		});

		it('sharerId should be facetable', () => {
			expect(sharerIdField?.facetable).toBe(true);
		});

		it('sharerId should not be searchable', () => {
			expect(sharerIdField?.searchable).toBe(false);
		});
	});

	describe('date fields', () => {
		const dateFieldNames = [
			'sharingPeriodStart',
			'sharingPeriodEnd',
			'createdAt',
			'updatedAt',
		];

		for (const fieldName of dateFieldNames) {
			describe(fieldName, () => {
				const dateField = ListingSearchIndexSpec.fields.find(
					(f) => f.name === fieldName,
				);

				it('should be defined', () => {
					expect(dateField).toBeDefined();
				});

				it('should be of type Edm.DateTimeOffset', () => {
					expect(dateField?.type).toBe('Edm.DateTimeOffset');
				});

				it('should be filterable', () => {
					expect(dateField?.filterable).toBe(true);
				});

				it('should be sortable', () => {
					expect(dateField?.sortable).toBe(true);
				});

				it('should not be searchable', () => {
					expect(dateField?.searchable).toBe(false);
				});

				it('should be retrievable', () => {
					expect(dateField?.retrievable).toBe(true);
				});
			});
		}

		it('createdAt should be facetable', () => {
			const createdAtField = ListingSearchIndexSpec.fields.find(
				(f) => f.name === 'createdAt',
			);
			expect(createdAtField?.facetable).toBe(true);
		});

		it('updatedAt should be facetable', () => {
			const updatedAtField = ListingSearchIndexSpec.fields.find(
				(f) => f.name === 'updatedAt',
			);
			expect(updatedAtField?.facetable).toBe(true);
		});
	});

	describe('images field', () => {
		const imagesField = ListingSearchIndexSpec.fields.find(
			(f) => f.name === 'images',
		);

		it('should be defined', () => {
			expect(imagesField).toBeDefined();
		});

		it('should be a collection type', () => {
			expect(imagesField?.type).toBe('Collection(Edm.String)');
		});

		it('should be retrievable', () => {
			expect(imagesField?.retrievable).toBe(true);
		});

		it('should not be searchable', () => {
			expect(imagesField?.searchable).toBe(false);
		});

		it('should not be filterable', () => {
			expect(imagesField?.filterable).toBe(false);
		});

		it('should not be sortable', () => {
			expect(imagesField?.sortable).toBe(false);
		});

		it('should not be facetable', () => {
			expect(imagesField?.facetable).toBe(false);
		});
	});
});

describe('convertListingToSearchDocument', () => {
	it('should convert a complete listing to search document', () => {
		const listing = {
			id: 'listing-123',
			title: 'Vintage Camera',
			description: 'A beautiful vintage camera from the 1960s',
			category: 'electronics',
			location: 'New York, NY',
			state: 'active',
			sharer: {
				id: 'user-456',
				account: {
					profile: {
						firstName: 'John',
						lastName: 'Doe',
					},
				},
			},
			sharingPeriodStart: new Date('2024-01-01T00:00:00Z'),
			sharingPeriodEnd: new Date('2024-12-31T23:59:59Z'),
			createdAt: new Date('2023-12-01T10:30:00Z'),
			updatedAt: new Date('2023-12-15T14:20:00Z'),
			images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.id).toBe('listing-123');
		expect(searchDoc.title).toBe('Vintage Camera');
		expect(searchDoc.description).toBe('A beautiful vintage camera from the 1960s');
		expect(searchDoc.category).toBe('electronics');
		expect(searchDoc.location).toBe('New York, NY');
		expect(searchDoc.state).toBe('active');
		expect(searchDoc.sharerName).toBe('John Doe');
		expect(searchDoc.sharerId).toBe('user-456');
		expect(searchDoc.sharingPeriodStart).toBe('2024-01-01T00:00:00.000Z');
		expect(searchDoc.sharingPeriodEnd).toBe('2024-12-31T23:59:59.000Z');
		expect(searchDoc.createdAt).toBe('2023-12-01T10:30:00.000Z');
		expect(searchDoc.updatedAt).toBe('2023-12-15T14:20:00.000Z');
		expect(searchDoc.images).toEqual(['image1.jpg', 'image2.jpg', 'image3.jpg']);
	});

	it('should handle missing sharer information', () => {
		const listing = {
			id: 'listing-789',
			title: 'Test Item',
			description: 'Test description',
			category: 'other',
			location: 'Unknown',
			state: 'pending',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
			images: [],
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharerName).toBe(' ');
		expect(searchDoc.sharerId).toBe('');
	});

	it('should handle sharer with only id', () => {
		const listing = {
			id: 'listing-abc',
			title: 'Test Item',
			description: 'Test description',
			category: 'other',
			location: 'Unknown',
			state: 'pending',
			sharer: {
				id: 'user-999',
			},
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
			images: [],
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharerId).toBe('user-999');
		expect(searchDoc.sharerName).toBe(' ');
	});

	it('should handle sharer with only firstName', () => {
		const listing = {
			id: 'listing-def',
			title: 'Test Item',
			sharer: {
				id: 'user-777',
				account: {
					profile: {
						firstName: 'Jane',
					},
				},
			},
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharerName).toBe('Jane ');
	});

	it('should handle sharer with only lastName', () => {
		const listing = {
			id: 'listing-ghi',
			title: 'Test Item',
			sharer: {
				id: 'user-888',
				account: {
					profile: {
						lastName: 'Smith',
					},
				},
			},
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharerName).toBe(' Smith');
	});

	it('should handle missing optional fields with defaults', () => {
		const listing = {
			id: 'listing-minimal',
			title: 'Minimal Listing',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.description).toBe('');
		expect(searchDoc.category).toBe('');
		expect(searchDoc.location).toBe('');
		expect(searchDoc.state).toBe('');
		expect(searchDoc.images).toEqual([]);
	});

	it('should convert date fields to ISO strings', () => {
		const testDate = new Date('2024-06-15T08:30:45.123Z');
		const listing = {
			id: 'listing-dates',
			title: 'Date Test',
			sharingPeriodStart: testDate,
			sharingPeriodEnd: testDate,
			createdAt: testDate,
			updatedAt: testDate,
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharingPeriodStart).toBe('2024-06-15T08:30:45.123Z');
		expect(searchDoc.sharingPeriodEnd).toBe('2024-06-15T08:30:45.123Z');
		expect(searchDoc.createdAt).toBe('2024-06-15T08:30:45.123Z');
		expect(searchDoc.updatedAt).toBe('2024-06-15T08:30:45.123Z');
	});

	it('should handle empty images array', () => {
		const listing = {
			id: 'listing-no-images',
			title: 'No Images',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
			images: [],
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.images).toEqual([]);
	});

	it('should preserve images array', () => {
		const listing = {
			id: 'listing-images',
			title: 'With Images',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
			images: ['a.jpg', 'b.png', 'c.gif', 'd.webp'],
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.images).toEqual(['a.jpg', 'b.png', 'c.gif', 'd.webp']);
	});

	it('should handle fields with toString() method', () => {
		const listing = {
			id: 'listing-tostring',
			title: 'Test',
			description: { toString: () => 'Custom description' },
			category: { toString: () => 'electronics' },
			location: { toString: () => 'Boston, MA' },
			state: { toString: () => 'active' },
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.description).toBe('Custom description');
		expect(searchDoc.category).toBe('electronics');
		expect(searchDoc.location).toBe('Boston, MA');
		expect(searchDoc.state).toBe('active');
	});

	it('should handle complex nested sharer structure', () => {
		const listing = {
			id: 'listing-nested',
			title: 'Nested Test',
			sharer: {
				id: 'user-complex',
				account: {
					profile: {
						firstName: 'Alice',
						lastName: 'Johnson',
						middleName: 'Marie', // Extra field should be ignored
					},
					email: 'alice@example.com', // Extra field should be ignored
				},
				role: 'admin', // Extra field should be ignored
			},
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharerId).toBe('user-complex');
		expect(searchDoc.sharerName).toBe('Alice Johnson');
	});

	it('should handle whitespace in sharer names', () => {
		const listing = {
			id: 'listing-whitespace',
			title: 'Whitespace Test',
			sharer: {
				id: 'user-space',
				account: {
					profile: {
						firstName: '  John  ',
						lastName: '  Doe  ',
					},
				},
			},
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2023-12-01'),
			updatedAt: new Date('2023-12-15'),
		};

		const searchDoc = convertListingToSearchDocument(listing);

		expect(searchDoc.sharerName).toBe('  John     Doe  ');
	});
});
