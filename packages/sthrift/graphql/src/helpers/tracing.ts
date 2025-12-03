import { trace, SpanStatusCode } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';

export async function withTrace<T>(
	tracerName: string,
	spanName: string,
	fn: (span: Span) => Promise<T>,
): Promise<T> {
	const tracer = trace.getTracer(tracerName);
	return await tracer.startActiveSpan(spanName, async (span) => {
		span.setAttribute('operation', spanName);
		try {
			const res = await fn(span);
			span.setStatus({ code: SpanStatusCode.OK });
			return res;
		} catch (err) {
			span.setAttribute('error', String(err));
			span.setStatus({ code: SpanStatusCode.ERROR });
			throw err;
		}
	});
}
