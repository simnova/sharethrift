/**
 * ESM Loader hook to handle asset imports and antd alias in Node.js.
 * - Handles CSS, SVG, images, and other assets that can't be imported in Node.js
 * - Aliases 'antd' to the local stub for DOM testing
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSET_EXTENSIONS = ['.css', '.module.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2', '.ttf', '.eot'];
const __dirname = dirname(fileURLToPath(import.meta.url));
const ANTD_STUB = `${__dirname}/stubs/antd.js`;

export function resolve(specifier, context, nextResolve) {
	// Alias 'antd' to our stub for DOM testing
	if (specifier === 'antd') {
		return {
			url: `file://${ANTD_STUB}`,
			shortCircuit: true,
		};
	}

	if (ASSET_EXTENSIONS.some((ext) => specifier.endsWith(ext))) {
		// Return a resolved module with a data URL to avoid file resolution
		return {
			url: `data:text/javascript;base64,ZXhwb3J0IGRlZmF1bHQge307`,
			format: 'module',
			shortCircuit: true,
		};
	}
	return nextResolve(specifier, context);
}
