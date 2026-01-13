import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROXY_PORT = 7072;
const TARGET_PORT = 7071; // Azure Functions default port
const IS_DAEMON_MODE = process.env.DAEMON_MODE === 'true';

const certPath = path.join(__dirname, '.certs', 'sharethrift.localhost.pem');
const keyPath = path.join(__dirname, '.certs', 'sharethrift.localhost-key.pem');

// Validate certificate files exist
if (!fs.existsSync(certPath)) {
	console.error(`Error: Certificate file not found: ${certPath}`);
	console.error('Run: pnpm run setup:certs');
	process.exit(1);
}

if (!fs.existsSync(keyPath)) {
	console.error(`Error: Certificate key file not found: ${keyPath}`);
	console.error('Run: pnpm run setup:certs');
	process.exit(1);
}

// Check if port is already in use before starting
function checkPortInUse(port) {
	return new Promise((resolve) => {
		const tester = net.createServer()
			.once('error', (err) => {
				if (err.code === 'EADDRINUSE') {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.once('listening', () => {
				tester.close();
				resolve(false);
			})
			.listen(port);
	});
}

const portInUse = await checkPortInUse(PROXY_PORT);

if (portInUse) {
	console.log(`✓ HTTPS proxy already running on port ${PROXY_PORT}`);
	process.exit(0);
}

// If not in daemon mode, spawn self as daemon and exit
if (!IS_DAEMON_MODE) {
	console.log('Starting HTTPS proxy in background...');
	const child = spawn(process.execPath, [__filename], {
		detached: true,
		stdio: 'ignore',
		env: { ...process.env, DAEMON_MODE: 'true' },
	});
	child.unref();
	console.log(`✓ HTTPS proxy started on https://data-access.sharethrift.localhost:${PROXY_PORT}`);
	process.exit(0);
}

const server = https.createServer({
	cert: fs.readFileSync(certPath),
	key: fs.readFileSync(keyPath),
}, (req, res) => {
	// Validate hostname
	const host = req.headers.host?.split(':')[0];
	if (host !== 'data-access.sharethrift.localhost') {
		res.writeHead(404);
		res.end('Not Found');
		return;
	}

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

// Handle server startup errors
server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`Error: Port ${PROXY_PORT} is already in use`);
		console.error('Another instance may be running. Stop it or use a different port.');
	} else if (err.code === 'EACCES') {
		console.error(`Error: Permission denied to bind to port ${PROXY_PORT}`);
		console.error('Try using a port > 1024 or run with elevated privileges.');
	} else {
		console.error('Server error:', err);
	}
	process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
	console.log('\nShutting down HTTPS proxy...');
	server.close(() => {
		console.log('HTTPS proxy stopped');
		process.exit(0);
	});
});

process.on('SIGTERM', () => {
	console.log('\nShutting down HTTPS proxy...');
	server.close(() => {
		console.log('HTTPS proxy stopped');
		process.exit(0);
	});
});

server.listen(PROXY_PORT, () => {
	console.log(`HTTPS proxy daemon listening on https://data-access.sharethrift.localhost:${PROXY_PORT}`);
	console.log(`Proxying to http://localhost:${TARGET_PORT}`);
});
