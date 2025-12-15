import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { SpanStatusCode } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';
import { expect, vi } from 'vitest';
import { withTrace } from './tracing.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/tracing.feature'),
);

// Mock span
function createMockSpan(): Span {
	return {
		setAttribute: vi.fn(),
		setStatus: vi.fn(),
		end: vi.fn(),
		recordException: vi.fn(),
		addEvent: vi.fn(),
		isRecording: vi.fn().mockReturnValue(true),
		updateName: vi.fn(),
		spanContext: vi.fn().mockReturnValue({
			traceId: 'mock-trace-id',
			spanId: 'mock-span-id',
			traceFlags: 1,
		}),
		setAttributes: vi.fn(),
		addLink: vi.fn(),
		addLinks: vi.fn(),
	} as unknown as Span;
}

// Mock the trace module
vi.mock('@opentelemetry/api', async (importOriginal) => {
	const original = await importOriginal<typeof import('@opentelemetry/api')>();
	return {
		...original,
		trace: {
			getTracer: vi.fn((tracerName: string) => ({
				startActiveSpan: vi.fn(
					(
						spanName: string,
						fn: (span: Span) => Promise<unknown>,
					): Promise<unknown> => {
						const mockSpan = createMockSpan();
						const globals = global as unknown as {
							__mockSpan?: Span;
							__mockTracerName?: string;
							__mockSpanName?: string;
						};
						// Store references for assertions
						globals.__mockSpan = mockSpan;
						globals.__mockTracerName = tracerName;
						globals.__mockSpanName = spanName;
						return fn(mockSpan);
					},
				),
			})),
		},
	};
});

test.for(feature, ({ Scenario }) => {
	let result: unknown;
	let error: Error | undefined;
	let mockSpan: Span;
	const tracerName = 'test-tracer';
	const spanName = 'test-span';

	Scenario('Successfully tracing a function', ({ Given, When, Then, And }) => {
		Given('a tracer name and span name', () => {
			// Setup is done in module level
		});

		When('withTrace is called with a successful function', async () => {
			result = await withTrace(tracerName, spanName, async (span) => {
				mockSpan = span;
				await Promise.resolve(); // Ensure async is used
				return 'success-value';
			});
		});

		Then('it should create a span with the operation attribute', () => {
			expect(mockSpan.setAttribute).toHaveBeenCalledWith('operation', spanName);
		});

		And('it should set the span status to OK', () => {
			expect(mockSpan.setStatus).toHaveBeenCalledWith({
				code: SpanStatusCode.OK,
			});
		});

		And('it should return the function result', () => {
			expect(result).toBe('success-value');
		});
	});

	Scenario(
		'Tracing a function that throws an error',
		({ Given, When, Then, And }) => {
			const testError = new Error('Test error');

			Given('a tracer name and span name', () => {
				// Setup is done in module level
			});

			When('withTrace is called with a function that throws', async () => {
				try {
					await withTrace(tracerName, spanName, async (span) => {
						mockSpan = span;
						await Promise.resolve(); // Ensure async is used
						throw testError;
					});
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should set the error attribute on the span', () => {
				expect(mockSpan.setAttribute).toHaveBeenCalledWith(
					'error',
					String(testError),
				);
			});

			And('it should set the span status to ERROR', () => {
				expect(mockSpan.setStatus).toHaveBeenCalledWith({
					code: SpanStatusCode.ERROR,
				});
			});

			And('it should rethrow the error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Test error');
			});
		},
	);
});
