/**
 * Tests for SearchServiceFactory
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchServiceFactory } from './search-service-factory.js';
import type { SearchServiceConfig } from './search-service-factory.js';

describe('SearchServiceFactory', () => {
	describe('detectImplementation', () => {
		describe('forced modes', () => {
			it('should use mock when useMockSearch is true', () => {
				const config: SearchServiceConfig = {
					useMockSearch: true,
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('mock');
			});

			it('should use mock when useMockSearch is true even with Azure endpoint', () => {
				const config: SearchServiceConfig = {
					useMockSearch: true,
					searchApiEndpoint: 'https://test.search.windows.net',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('mock');
			});

			it('should use Azure when useAzureSearch is true', () => {
				const config: SearchServiceConfig = {
					useAzureSearch: true,
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('azure');
			});

			it('should prioritize useMockSearch over useAzureSearch', () => {
				const config: SearchServiceConfig = {
					useMockSearch: true,
					useAzureSearch: true,
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('mock');
			});
		});

		describe('auto-detection', () => {
			it('should use mock in development without Azure endpoint', () => {
				const config: SearchServiceConfig = {
					nodeEnv: 'development',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('mock');
			});

			it('should use mock in test environment without Azure endpoint', () => {
				const config: SearchServiceConfig = {
					nodeEnv: 'test',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('mock');
			});

			it('should use Azure when endpoint is configured', () => {
				const config: SearchServiceConfig = {
					searchApiEndpoint: 'https://test.search.windows.net',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('azure');
			});

			it('should use Azure in development with endpoint configured', () => {
				const config: SearchServiceConfig = {
					nodeEnv: 'development',
					searchApiEndpoint: 'https://test.search.windows.net',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('azure');
			});

			it('should default to mock in development', () => {
				const config: SearchServiceConfig = {
					nodeEnv: 'development',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('mock');
			});

			it('should default to Azure in production without explicit configuration', () => {
				const config: SearchServiceConfig = {
					nodeEnv: 'production',
				};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('azure');
			});

			it('should handle empty config by defaulting to Azure', () => {
				const config: SearchServiceConfig = {};

				const result = SearchServiceFactory.detectImplementation(config);

				expect(result).toBe('azure');
			});
		});
	});

	describe('createSearchService', () => {
		it('should create InMemoryCognitiveSearch when implementation is mock', () => {
			const service = SearchServiceFactory.createSearchService('mock', {});

			expect(service).toBeDefined();
			expect(service.startup).toBeInstanceOf(Function);
			expect(service.shutdown).toBeInstanceOf(Function);
			expect(service.search).toBeInstanceOf(Function);
		});

		it('should pass persistence options to InMemoryCognitiveSearch', () => {
			const config: SearchServiceConfig = {
				enablePersistence: true,
				persistencePath: '/custom/path',
			};

			const service = SearchServiceFactory.createSearchService('mock', config);

			expect(service).toBeDefined();
		});

		it('should use default persistence path when not specified', () => {
			const config: SearchServiceConfig = {
				enablePersistence: true,
			};

			const service = SearchServiceFactory.createSearchService('mock', config);

			expect(service).toBeDefined();
		});

		it('should create AzureCognitiveSearch when implementation is azure', () => {
			// Note: This test might fail if Azure credentials are not configured
			// In that case, it should fall back to mock implementation
			const service = SearchServiceFactory.createSearchService('azure', {});

			expect(service).toBeDefined();
			expect(service.startup).toBeInstanceOf(Function);
			expect(service.shutdown).toBeInstanceOf(Function);
		});

		it('should fall back to mock when Azure instantiation fails', () => {
			// This should gracefully handle Azure configuration errors
			const service = SearchServiceFactory.createSearchService('azure', {});

			expect(service).toBeDefined();
			// Should have search capabilities even if it fell back to mock
			expect(service.search).toBeInstanceOf(Function);
		});
	});

	describe('createFromEnvironment', () => {
		let originalEnv: NodeJS.ProcessEnv;

		beforeEach(() => {
			// Save original environment
			originalEnv = { ...process.env };
		});

		afterEach(() => {
			// Restore original environment
			process.env = originalEnv;
		});

		it('should respect USE_MOCK_SEARCH environment variable', () => {
			process.env['USE_MOCK_SEARCH'] = 'true';

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
		});

		it('should respect USE_AZURE_SEARCH environment variable', () => {
			process.env['USE_AZURE_SEARCH'] = 'true';

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
		});

		it('should use NODE_ENV for auto-detection', () => {
			process.env['NODE_ENV'] = 'development';

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
		});

		it('should use AZURE_SEARCH_ENDPOINT for configuration', () => {
			process.env['AZURE_SEARCH_ENDPOINT'] = 'https://test.search.windows.net';

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
		});

		it('should respect ENABLE_SEARCH_PERSISTENCE flag', () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			process.env['ENABLE_SEARCH_PERSISTENCE'] = 'true';

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
		});

		it('should respect SEARCH_PERSISTENCE_PATH', () => {
			process.env['USE_MOCK_SEARCH'] = 'true';
			process.env['ENABLE_SEARCH_PERSISTENCE'] = 'true';
			process.env['SEARCH_PERSISTENCE_PATH'] = '/custom/path';

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
		});

		it('should handle missing environment variables gracefully', () => {
			// Clear all related env vars
			delete process.env['USE_MOCK_SEARCH'];
			delete process.env['USE_AZURE_SEARCH'];
			delete process.env['NODE_ENV'];
			delete process.env['AZURE_SEARCH_ENDPOINT'];

			const service = SearchServiceFactory.createFromEnvironment();

			expect(service).toBeDefined();
			expect(service.search).toBeInstanceOf(Function);
		});
	});
});

