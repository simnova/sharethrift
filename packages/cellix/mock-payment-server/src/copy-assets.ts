import { copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = join(__dirname, '../../src/iframe.min.js');
const dest = join(__dirname, '../src/iframe.min.js');

copyFileSync(src, dest);
console.log('Copied iframe.min.js to dist');
