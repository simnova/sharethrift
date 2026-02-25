import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '3002';
spawn('docusaurus', ['start', '--port', port, '--no-open'], { stdio: 'inherit' });
