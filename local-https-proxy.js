/**
 * Local HTTPS Proxy for Azure Functions
 * 
 * Azure Functions Core Tools doesn't support HTTPS natively,
 * so this proxy forwards HTTPS requests to the HTTP function host.
 * 
 * Usage: node local-https-proxy.js
 */

import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTTPS_PORT = 7443;
const FUNCTIONS_PORT = 7071;
const HOST = 'api.sharethrift.localhost';

const options = {
	key: fs.readFileSync(path.join(__dirname, '.certs/sharethrift.localhost-key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '.certs/sharethrift.localhost.pem')),
};

const proxy = https.createServer(options, (req, res) => {
	const proxyReq = http.request({
		hostname: 'localhost',
		port: FUNCTIONS_PORT,
		path: req.url,
		method: req.method,
		headers: {
			...req.headers,
			host: 'localhost:' + FUNCTIONS_PORT,
		},
	}, (proxyRes) => {
		res.writeHead(proxyRes.statusCode, proxyRes.headers);
		proxyRes.pipe(res);
	});

	proxyReq.on('error', (error) => {
		console.error('Proxy error:', error);
		res.writeHead(502);
		res.end('Bad Gateway');
	});

	req.pipe(proxyReq);
});

proxy.listen(HTTPS_PORT, HOST, () => {
	console.log(` HTTPS Proxy running at https://${HOST}:${HTTPS_PORT}`);
	console.log(`   Forwarding to http://localhost:${FUNCTIONS_PORT}`);
	console.log('');
	console.log(' Ready to accept requests');
});
