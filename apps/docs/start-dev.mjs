import { spawn } from 'node:child_process';

const envPort = process.env.PORT;

if (!envPort) {
	console.error(
		'PORT environment variable is not set. Ensure portless (or your dev environment) is running and has injected a port.',
	);
	process.exit(1);
}

const port = envPort;
// Use 127.0.0.1 explicitly to ensure IPv4 binding — portless proxy connects via IPv4,
// but Node.js may resolve 'localhost' to ::1 (IPv6) on macOS, causing Bad Gateway.
spawn('pnpm', ['exec', 'docusaurus', 'start', '--host', '127.0.0.1', '--port', port, '--no-open'], { stdio: 'inherit' });
