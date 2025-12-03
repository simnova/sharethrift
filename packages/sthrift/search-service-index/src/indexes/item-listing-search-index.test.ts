import { describe, expect, it } from 'vitest';
import { ItemListingSearchIndexSpec } from './item-listing-search-index.js';

describe('ItemListingSearchIndexSpec', () => {
	it('should have correct index name', () => {
		expect(ItemListingSearchIndexSpec.name).toBeDefined();
		expect(typeof ItemListingSearchIndexSpec.name).toBe('string');
	});

	it('should define all required fields', () => {
		expect(ItemListingSearchIndexSpec.fields).toBeDefined();
		expect(Array.isArray(ItemListingSearchIndexSpec.fields)).toBe(true);
		expect(ItemListingSearchIndexSpec.fields.length).toBeGreaterThan(0);
	});

	it('should have id field as key', () => {
		const idField = ItemListingSearchIndexSpec.fields.find(
			(f) => f.name === 'id',
		);
		expect(idField).toBeDefined();
		expect(idField?.key).toBe(true);
		expect(idField?.type).toBe('Edm.String');
	});

	it('should have searchable text fields', () => {
		const searchableFields = ['title', 'description', 'category', 'location', 'sharerName'];
		
		for (const fieldName of searchableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.searchable, `Field ${fieldName} should be searchable`).toBe(true);
		}
	});

	it('should have filterable fields', () => {
		const filterableFields = ['category', 'location', 'state', 'sharerId', 'sharingPeriodStart', 'sharingPeriodEnd', 'createdAt', 'updatedAt'];
		
		for (const fieldName of filterableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.filterable, `Field ${fieldName} should be filterable`).toBe(true);
		}
	});

	it('should have sortable fields', () => {
		const sortableFields = ['title', 'category', 'state', 'sharingPeriodStart', 'sharingPeriodEnd', 'createdAt', 'updatedAt'];
		
		for (const fieldName of sortableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.sortable, `Field ${fieldName} should be sortable`).toBe(true);
		}
	});

	it('should have facetable fields', () => {
		const facetableFields = ['category', 'location', 'state', 'sharerId', 'createdAt', 'updatedAt'];
		
		for (const fieldName of facetableFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.facetable, `Field ${fieldName} should be facetable`).toBe(true);
		}
	});

	it('should have date fields with correct type', () => {
		const dateFields = ['sharingPeriodStart', 'sharingPeriodEnd', 'createdAt', 'updatedAt'];
		
		for (const fieldName of dateFields) {
			const field = ItemListingSearchIndexSpec.fields.find(
				(f) => f.name === fieldName,
			);
			expect(field, `Field ${fieldName} should exist`).toBeDefined();
			expect(field?.type, `Field ${fieldName} should be DateTimeOffset`).toBe('Edm.DateTimeOffset');
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

	it('should have all fields as retrievable', () => {
		for (const field of ItemListingSearchIndexSpec.fields) {
			expect(field.retrievable, `Field ${field.name} should be retrievable`).toBe(true);
		}
	});

	it('should contain all expected field names', () => {
		const expectedFields = [
			'id',
			'title',
			'description',
			'category',
			'location',
			'state',
			'sharerId',
			'sharerName',
			'sharingPeriodStart',
			'sharingPeriodEnd',
			'createdAt',
			'updatedAt',
			'images',
		];

		const actualFieldNames = ItemListingSearchIndexSpec.fields.map((f) => f.name);
		
		for (const expectedField of expectedFields) {
			expect(actualFieldNames, `Should contain field ${expectedField}`).toContain(expectedField);
		}
		
		expect(actualFieldNames.length).toBe(expectedFields.length);
	});

	it('should have correct field count', () => {
		expect(ItemListingSearchIndexSpec.fields).toHaveLength(13);
	});
});
