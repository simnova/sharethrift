import { spawn } from 'node:child_process';

const port = process.env.PORT;
const host = process.env.HOST || '127.0.0.1';

if (!port) {
	console.error(
		'PORT environment variable is not set. Ensure portless (or your dev environment) is running.',
	);
	process.exit(1);
}

// Portless injects HOST=127.0.0.1 — use it to ensure IPv4 binding.
// macOS may resolve 'localhost' to ::1 (IPv6), causing a proxy Bad Gateway.
const child = spawn('pnpm', ['exec', 'docusaurus', 'start', '--host', host, '--port', port, '--no-open'], { stdio: 'inherit' });
child.on('exit', (code, signal) => {
	process.exitCode = signal ? 1 : (code ?? 1);
});
