import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '3002';
// Use 127.0.0.1 explicitly to ensure IPv4 binding — portless proxy connects via IPv4,
// but Node.js may resolve 'localhost' to ::1 (IPv6) on macOS, causing Bad Gateway.
spawn('pnpm', ['exec', 'docusaurus', 'start', '--host', '127.0.0.1', '--port', port, '--no-open'], { stdio: 'inherit' });
