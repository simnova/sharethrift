import { mkdir, cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = resolve(__dirname, '..', 'src');
const destDir = resolve(__dirname, '..', 'dist', 'src');

await mkdir(destDir, { recursive: true });

// Copy all files recursively; the build only outputs JS/DTs into dist/src,
// so copying the entire src tree preserves CSS and assets alongside.
try {
	await cp(srcDir, destDir, { recursive: true });
} catch (error) {
	console.error('Failed to copy assets:', error);
	process.exit(1);
}
