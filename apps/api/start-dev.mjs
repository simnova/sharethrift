import { spawn } from 'node:child_process';

const port = process.env.PORT;

if (!port) {
	console.error(
		'PORT environment variable is not set. Ensure portless (or your dev environment) is running.',
	);
	process.exit(1);
}

const child = spawn('func', ['start', '--typescript', '--port', port], { stdio: 'inherit' });
child.on('exit', (code, signal) => {
	process.exitCode = signal ? 1 : (code ?? 1);
});
