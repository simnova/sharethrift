import { describe, expect, it } from 'vitest';
import {
	ItemListingSearchIndexSpec,
	convertItemListingToSearchDocument,
} from './item-listing-search-index.js';

describe('ItemListingSearchIndexSpec', () => {
	it('should have correct index name', () => {
		expect(ItemListingSearchIndexSpec.name).toBe('item-listings');
	});

	it('should have id field as key', () => {
		const idField = ItemListingSearchIndexSpec.fields.find((f) => f.name === 'id');
		expect(idField).toBeDefined();
		expect(idField?.key).toBe(true);
		expect(idField?.type).toBe('Edm.String');
		expect(idField?.filterable).toBe(true);
	});

	it('should have searchable text fields', () => {
		const searchableFields = ['title', 'description', 'location', 'sharerName'];

		for (const fieldName of searchableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.searchable, `Field ${fieldName} should be searchable`).toBe(
				true,
			);
		}
	});

	it('should have filterable fields', () => {
		const filterableFields = [
			'id',
			'category',
			'state',
			'sharerId',
			'location',
			'sharingPeriodStart',
			'sharingPeriodEnd',
			'createdAt',
			'updatedAt',
		];

		for (const fieldName of filterableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.filterable, `Field ${fieldName} should be filterable`).toBe(
				true,
			);
		}
	});

	it('should have facetable fields', () => {
		const facetableFields = [
			'category',
			'state',
			'sharerId',
			'createdAt',
			'updatedAt',
		];

		for (const fieldName of facetableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.facetable, `Field ${fieldName} should be facetable`).toBe(
				true,
			);
		}
	});

	it('should have date fields with correct type', () => {
		const dateFields = [
			'sharingPeriodStart',
			'sharingPeriodEnd',
			'createdAt',
			'updatedAt',
		];

		for (const fieldName of dateFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(
				field?.type,
				`Field ${fieldName} should be DateTimeOffset`,
			).toBe('Edm.DateTimeOffset');
		}
	});

	it('should have images field as collection', () => {
		const imagesField = ItemListingSearchIndexSpec.fields.find(
			(f) => f.name === 'images',
		);
		expect(imagesField).toBeDefined();
		expect(imagesField?.type).toBe('Collection(Edm.String)');
		expect(imagesField?.retrievable).toBe(true);
	});
});

describe('convertItemListingToSearchDocument', () => {
	it('should convert complete item listing to search document', () => {
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			description: 'Test description',
			category: 'Books',
			location: 'New York',
			state: 'active',
			sharingPeriodStart: new Date('2025-01-01'),
			sharingPeriodEnd: new Date('2025-12-31'),
			createdAt: new Date('2024-12-01'),
			updatedAt: new Date('2024-12-03'),
			images: ['image1.jpg', 'image2.jpg'],
			sharer: {
				id: 'sharer-456',
				account: {
					profile: {
						firstName: 'John',
						lastName: 'Doe',
					},
				},
			},
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.id).toBe('listing-123');
		expect(result.title).toBe('Test Listing');
		expect(result.description).toBe('Test description');
		expect(result.category).toBe('Books');
		expect(result.location).toBe('New York');
		expect(result.state).toBe('active');
		expect(result.sharerName).toBe('John Doe');
		expect(result.sharerId).toBe('sharer-456');
		expect(result.sharingPeriodStart).toBe('2025-01-01T00:00:00.000Z');
		expect(result.sharingPeriodEnd).toBe('2025-12-31T00:00:00.000Z');
		expect(result.createdAt).toBe('2024-12-01T00:00:00.000Z');
		expect(result.updatedAt).toBe('2024-12-03T00:00:00.000Z');
		expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
	});

	it('should handle missing optional fields', () => {
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.id).toBe('listing-123');
		expect(result.title).toBe('Test Listing');
		expect(result.description).toBe('');
		expect(result.category).toBe('');
		expect(result.location).toBe('');
		expect(result.state).toBe('');
		expect(result.sharerName).toBe(' '); // Space from firstName + ' ' + lastName when both empty
		expect(result.sharerId).toBe('');
		expect(result.images).toEqual([]);
	});

	it('should handle missing sharer information', () => {
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			description: 'Test description',
		};

				const result = convertItemListingToSearchDocument(itemListing);

		expect(result.sharerName).toBe(' '); // Space from firstName + ' ' + lastName when both empty
		expect(result.sharerId).toBe('');
	});

	it('should handle partial sharer information', () => {
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			sharer: {
				id: 'sharer-456',
				account: {
					profile: {
						firstName: 'John',
					},
				},
			},
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.sharerName).toBe('John ');
		expect(result.sharerId).toBe('sharer-456');
	});

	it('should handle missing profile information', () => {
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			sharer: {
				id: 'sharer-456',
				account: {},
			},
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.sharerName).toBe(' '); // Space from firstName + ' ' + lastName when both empty
		expect(result.sharerId).toBe('sharer-456');
	});

	it('should convert dates to ISO strings', () => {
		const testDate = new Date('2025-06-15T10:30:00.000Z');
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			sharingPeriodStart: testDate,
			sharingPeriodEnd: testDate,
			createdAt: testDate,
			updatedAt: testDate,
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.sharingPeriodStart).toBe('2025-06-15T10:30:00.000Z');
		expect(result.sharingPeriodEnd).toBe('2025-06-15T10:30:00.000Z');
		expect(result.createdAt).toBe('2025-06-15T10:30:00.000Z');
		expect(result.updatedAt).toBe('2025-06-15T10:30:00.000Z');
	});

	it('should handle empty images array', () => {
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			images: [],
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.images).toEqual([]);
	});

	it('should preserve images array', () => {
		const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
		const itemListing = {
			id: 'listing-123',
			title: 'Test Listing',
			images,
		};

		const result = convertItemListingToSearchDocument(itemListing);

		expect(result.images).toEqual(images);
	});
});
