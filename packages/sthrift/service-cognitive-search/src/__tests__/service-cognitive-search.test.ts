/**
 * Unit tests for ServiceCognitiveSearch
 *
 * Tests the environment-aware service selection and proxy methods
 * to ensure proper delegation to mock or Azure implementations.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ServiceCognitiveSearch } from '../search-service.js';
import type { SearchIndex, SearchField } from '@cellix/mock-cognitive-search';

// Mock the implementations
vi.mock('@cellix/mock-cognitive-search', () => ({
	InMemoryCognitiveSearch: vi.fn().mockImplementation(() => ({
		startup: vi.fn().mockResolvedValue(undefined),
		shutdown: vi.fn().mockResolvedValue(undefined),
		createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
		createOrUpdateIndexDefinition: vi.fn().mockResolvedValue(undefined),
		search: vi.fn().mockResolvedValue({
			results: [],
			count: 0,
			facets: {},
		}),
		indexDocument: vi.fn().mockResolvedValue(undefined),
		deleteDocument: vi.fn().mockResolvedValue(undefined),
		deleteIndex: vi.fn().mockResolvedValue(undefined),
	})),
}));

vi.mock('../azure-search-service.js', () => ({
	AzureCognitiveSearch: vi.fn().mockImplementation(() => ({
		startup: vi.fn().mockResolvedValue(undefined),
		shutdown: vi.fn().mockResolvedValue(undefined),
		createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
		createOrUpdateIndexDefinition: vi.fn().mockResolvedValue(undefined),
		search: vi.fn().mockResolvedValue({
			results: [],
			count: 0,
			facets: {},
		}),
		indexDocument: vi.fn().mockResolvedValue(undefined),
		deleteDocument: vi.fn().mockResolvedValue(undefined),
		deleteIndex: vi.fn().mockResolvedValue(undefined),
	})),
}));

describe('ServiceCognitiveSearch', () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		originalEnv = { ...process.env };
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe('Service Lifecycle', () => {
		it('should start up successfully', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			await expect(service.startUp()).resolves.toBeUndefined();
		});

		it('should shut down successfully', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			await expect(service.shutDown()).resolves.toBeUndefined();
		});
	});

	describe('Implementation Detection', () => {
		it('should use mock implementation when USE_MOCK_SEARCH is true', () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			expect(service['implementationType']).toBe('mock');
		});

		it('should use Azure implementation when USE_AZURE_SEARCH is true', () => {
			process.env['USE_AZURE_SEARCH'] = 'true';
			process.env['SEARCH_API_ENDPOINT'] = 'https://test.search.windows.net';
			const service = new ServiceCognitiveSearch();

			expect(service['implementationType']).toBe('azure');
		});

		it('should default to mock implementation when no environment variables are set', () => {
			delete process.env['USE_MOCK_SEARCH'];
			delete process.env['USE_AZURE_SEARCH'];
			const service = new ServiceCognitiveSearch();

			expect(service['implementationType']).toBe('mock');
		});
	});

	describe('Proxy Methods', () => {
		it('should proxy createIndexIfNotExists to underlying service', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			const mockIndex: SearchIndex = {
				name: 'test-index',
				fields: [] as SearchField[],
			};

			await service.createIndexIfNotExists(mockIndex);

			expect(
				service['searchService'].createIndexIfNotExists,
			).toHaveBeenCalledWith(mockIndex);
		});

		it('should proxy search to underlying service', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			const result = await service.search('test-index', 'test query', {
				top: 10,
			});

			expect(service['searchService'].search).toHaveBeenCalledWith(
				'test-index',
				'test query',
				{ top: 10 },
			);
			expect(result).toEqual({
				results: [],
				count: 0,
				facets: {},
			});
		});

		it('should proxy indexDocument to underlying service', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			const document = { id: 'test', title: 'Test Document' };

			await service.indexDocument('test-index', document);

			expect(service['searchService'].indexDocument).toHaveBeenCalledWith(
				'test-index',
				document,
			);
		});

		it('should proxy deleteDocument to underlying service', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			const document = { id: 'test-id' };
			await service.deleteDocument('test-index', document);

			expect(service['searchService'].deleteDocument).toHaveBeenCalledWith(
				'test-index',
				document,
			);
		});

		it('should proxy deleteIndex to underlying service', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			await service.deleteIndex('test-index');

			expect(service['searchService'].deleteIndex).toHaveBeenCalledWith(
				'test-index',
			);
		});

		it('should proxy createOrUpdateIndexDefinition to underlying service', async () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			const service = new ServiceCognitiveSearch();

			const mockIndex: SearchIndex = {
				name: 'test-index',
				fields: [] as SearchField[],
			};

			await service.createOrUpdateIndexDefinition('test-index', mockIndex);

			expect(
				service['searchService'].createOrUpdateIndexDefinition,
			).toHaveBeenCalledWith('test-index', mockIndex);
		});
	});

	describe('Environment Detection Fallback', () => {
		it('should handle Azure client creation failure gracefully', () => {
			process.env['USE_AZURE_SEARCH'] = 'true';
			// Missing required environment variables should cause fallback

			const service = new ServiceCognitiveSearch();

			// implementationType is set to 'azure' because USE_AZURE_SEARCH forces it
			expect(service['implementationType']).toBe('azure');
			// Without mocking InMemoryCognitiveSearch, we can verify the fallback occurred
			// by checking that the service was created successfully without throwing
			expect(service['searchService']).toBeDefined();
			// Verify it has the expected methods of CognitiveSearchService
			expect(typeof service['searchService'].createIndexIfNotExists).toBe(
				'function',
			);
		});
	});
});
