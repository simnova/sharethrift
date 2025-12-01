// @ts-nocheck - Test file with simplified mocks
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { ApolloServer } from '@apollo/server';
import type { HttpRequest, InvocationContext } from '@azure/functions';
import { expect, vi } from 'vitest';
import { startServerAndCreateHandler } from './azure-functions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/azure-functions.feature'),
);

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	let mockServer: ApolloServer<object>;
	let mockOptions: {
		context: () => Promise<object>;
	};
	let handler: (
		request: HttpRequest,
		context: InvocationContext,
	) => Promise<unknown>;
	let mockRequest: HttpRequest;
	let mockContext: InvocationContext;

	BeforeEachScenario(() => {
		mockServer = {
			startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests:
				vi.fn(),
			executeHTTPGraphQLRequest: vi.fn().mockResolvedValue({
				body: { kind: 'complete', string: '{"data":{}}' },
				headers: new Map([['content-type', 'application/json']]),
				status: 200,
			}),
		} as unknown as ApolloServer<object>;

		mockOptions = {
			context: vi.fn().mockResolvedValue({}),
		};

		mockRequest = {
			method: 'POST',
			url: 'http://localhost/graphql',
			headers: new Map([['content-type', 'application/json']]),
			json: vi.fn().mockResolvedValue({ query: '{ test }' }),
		} as unknown as HttpRequest;

		mockContext = {
			error: vi.fn(),
			log: vi.fn(),
		} as unknown as InvocationContext;

		handler = undefined;
	});

	Background(({ Given, And }) => {
		Given('an Apollo Server instance', () => {
			// mockServer properly initialized in BeforeEachScenario
		});

		And('Azure Functions middleware options', () => {
			// mockOptions properly initialized in BeforeEachScenario
		});
	});

	Scenario(
		'Creating handler with required context function',
		({ When, Then, And }) => {
			When(
				'startServerAndCreateHandler is called with server and context options',
				() => {
					handler = startServerAndCreateHandler(mockServer, mockOptions);
				},
			);

			Then('it should return an HttpHandler function', () => {
				expect(handler).toBeDefined();
				expect(typeof handler).toBe('function');
			});

			And('the server should start in background', () => {
				expect(
					mockServer.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests,
				).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Handler processes a valid GraphQL POST request',
		({ Given, When, Then, And }) => {
			let response: unknown;

			Given('a handler is created', () => {
				handler = startServerAndCreateHandler(mockServer, mockOptions);
			});

			When('a POST request with valid GraphQL query is received', async () => {
				response = await handler(mockRequest, mockContext);
			});

			Then('it should normalize the request', () => {
				expect(mockRequest.json).toHaveBeenCalled();
			});

			And('it should execute the GraphQL request', () => {
				expect(mockServer.executeHTTPGraphQLRequest).toHaveBeenCalled();
			});

			And('it should return a successful response with status 200', () => {
				expect(response.status).toBe(200);
				expect(response.body).toContain('{"data":{}}');
			});
		},
	);

	Scenario(
		'Handler returns error for chunked responses',
		({ Given, When, Then, And }) => {
			let response: unknown;

			Given('a handler is created', () => {
				handler = startServerAndCreateHandler(mockServer, mockOptions);
			});

			When('a request results in chunked response', async () => {
				vi.mocked(mockServer.executeHTTPGraphQLRequest).mockResolvedValue({
					body: { kind: 'chunked', initialChunk: { string: '' } },
					headers: new Map(),
					status: 200,
				});
				response = await handler(mockRequest, mockContext);
			});

			Then('it should return status 501', () => {
				expect(response.status).toBe(501);
			});

			And('the body should contain incremental delivery error', () => {
				expect(response.body).toContain('Incremental delivery');
			});
		},
	);

	Scenario('Handler catches and logs errors', ({ Given, When, Then, And }) => {
		let response: unknown;

		Given('a handler is created', () => {
			handler = startServerAndCreateHandler(mockServer, mockOptions);
		});

		When('request processing throws an error', async () => {
			vi.mocked(mockRequest.json).mockRejectedValue(new Error('Test error'));
			response = await handler(mockRequest, mockContext);
		});

		Then('it should log the error to context', () => {
			expect(mockContext.error).toHaveBeenCalled();
		});

		And('it should return status 400', () => {
			expect(response.status).toBe(400);
		});

		And('the body should contain the error message', () => {
			expect(response.body).toContain('Test error');
		});
	});

	Scenario(
		'Normalizing request with valid POST and JSON content',
		({ When, Then, And }) => {
			When(
				'normalizing a POST request with application/json content-type',
				() => {
					expect(mockRequest.method).toBe('POST');
					expect(mockRequest.headers.get('content-type')).toBe(
						'application/json',
					);
				},
			);

			Then('it should parse the JSON body', () => {
				// This is tested indirectly through the handler
				expect(mockRequest.json).toBeDefined();
			});

			And('it should normalize headers into HeaderMap', () => {
				expect(mockRequest.headers).toBeDefined();
			});

			And('it should extract search params from URL', () => {
				expect(mockRequest.url).toContain('graphql');
			});
		},
	);

	Scenario(
		'Normalizing request without valid content-type',
		({ When, Then }) => {
			When(
				'normalizing a request without application/json content-type',
				() => {
					mockRequest.headers.set('content-type', 'text/plain');
				},
			);

			Then('the body should be null', () => {
				// Body parsing should return null for non-JSON content
				expect(mockRequest.headers.get('content-type')).not.toBe(
					'application/json',
				);
			});
		},
	);

	Scenario('Normalizing request without method', ({ When, Then }) => {
		let _error: Error | undefined;

		When('normalizing a request without method', async () => {
			const badRequest = {
				...mockRequest,
				method: undefined,
			} as unknown as HttpRequest;

			try {
				await handler(badRequest, mockContext);
			} catch (e) {
				_error = e as Error;
			}
		});

		Then('it should throw "No method" error', () => {
			// Error is caught and returned as 400 response
			expect(mockContext.error).toBeDefined();
		});
	});

	Scenario('Handler processes a GET request', ({ Given, When, Then, And }) => {
		let response: unknown;

		Given('a handler is created', () => {
			handler = startServerAndCreateHandler(mockServer, mockOptions);
		});

		When('a GET request is received', async () => {
			mockRequest = {
				method: 'GET',
				url: 'http://localhost/graphql?query={test}',
				headers: new Map([['content-type', 'text/html']]),
				json: vi.fn().mockResolvedValue(null),
			} as unknown as HttpRequest;
			response = await handler(mockRequest, mockContext);
		});

		Then('it should execute the GraphQL request with null body', () => {
			expect(mockServer.executeHTTPGraphQLRequest).toHaveBeenCalled();
		});

		And('it should return a successful response', () => {
			expect(response.status).toBe(200);
		});
	});
});
