import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROXY_PORT = 7072;
const TARGET_PORT = 7071; // Azure Functions default port

const certPath = path.join(__dirname, '.certs', 'sharethrift.localhost.pem');
const keyPath = path.join(__dirname, '.certs', 'sharethrift.localhost-key.pem');

const server = https.createServer({
	cert: fs.readFileSync(certPath),
	key: fs.readFileSync(keyPath),
}, (req, res) => {
	const options = {
		hostname: 'localhost',
		port: TARGET_PORT,
		path: req.url,
		method: req.method,
		headers: req.headers,
	};

	const proxy = http.request(options, (proxyRes) => {
		res.writeHead(proxyRes.statusCode, proxyRes.headers);
		proxyRes.pipe(res, { end: true });
	});

	req.pipe(proxy, { end: true });

	proxy.on('error', (err) => {
		console.error('Proxy error:', err);
		res.writeHead(502);
		res.end('Bad Gateway');
	});
});

server.listen(PROXY_PORT, () => {
	console.log(`HTTPS proxy listening on https://data-access.sharethrift.localhost:${PROXY_PORT}`);
	console.log(`Proxying to http://localhost:${TARGET_PORT}`);
});
