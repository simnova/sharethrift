import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '7071';
spawn('func', ['start', '--typescript', '--port', port], { stdio: 'inherit' });
