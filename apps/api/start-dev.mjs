import { spawn } from 'node:child_process';

const envPort = process.env.PORT;

if (!envPort) {
	console.error(
		'PORT environment variable is not set. Ensure portless (or your dev environment) is running and has injected a port.',
	);
	process.exit(1);
}

const port = envPort;
spawn('func', ['start', '--typescript', '--port', port], { stdio: 'inherit' });
