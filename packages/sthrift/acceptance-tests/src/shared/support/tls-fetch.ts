import https from 'node:https';
import http from 'node:http';

export interface TlsFetchResponse {
	ok: boolean;
	status: number;
	text: () => Promise<string>;
	json: () => Promise<unknown>;
}
export function tlsFetch(
	url: string,
	options: { method?: string; headers?: Record<string, string>; body?: string } = {},
): Promise<TlsFetchResponse> {
	return new Promise((resolve, reject) => {
		const parsed = new URL(url);
		const isHttps = parsed.protocol === 'https:';
		const transport = isHttps ? https : http;

		const requestHeaders = { ...options.headers };
		if (options.body && !requestHeaders['Content-Length']) {
			requestHeaders['Content-Length'] = Buffer.byteLength(options.body).toString();
		}

		const req = transport.request(
			{
				hostname: parsed.hostname,
				port: parsed.port || (isHttps ? 443 : 80),
				path: parsed.pathname + parsed.search,
				method: options.method ?? 'GET',
				headers: requestHeaders,
				...(isHttps ? { rejectUnauthorized: false } : {}),
			},
			(res) => {
				let body = '';
				res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
				res.on('end', () => {
					const status = res.statusCode ?? 0;
					resolve({
						ok: status >= 200 && status < 300,
						status,
						text: () => Promise.resolve(body),
						json: () => Promise.resolve(JSON.parse(body)),
					});
				});
			},
		);

		req.on('error', reject);
		if (options.body) req.write(options.body);
		req.end();
	});
}
