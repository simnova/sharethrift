/**
 * ESM loader hooks for running UI component tests in Node.js (cucumber-js).
 *
 * Handles two issues when loading React components (with antd) in Node.js:
 * 1. Non-JS asset imports (CSS, SVG, images) — stubs them as empty modules
 * 2. antd / @ant-design — redirects to lightweight HTML-based stubs so that
 *    @testing-library queries and userEvent interactions work without pulling
 *    in the real antd bundle (which has broken extensionless ESM imports)
 */
const ASSET_EXTENSIONS = ['.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

const STUBS_DIR = new URL('./stubs/', import.meta.url);

export function resolve(specifier, context, nextResolve) {
	// Redirect antd imports to lightweight stubs
	if (specifier === 'antd') {
		return { url: new URL('antd.js', STUBS_DIR).href, shortCircuit: true };
	}
	if (specifier === 'antd/es/input/TextArea') {
		return { url: new URL('antd-textarea.js', STUBS_DIR).href, shortCircuit: true };
	}
	if (specifier === '@ant-design/icons') {
		return { url: new URL('antd-icons.js', STUBS_DIR).href, shortCircuit: true };
	}
	if (specifier.startsWith('antd/') || specifier.startsWith('@ant-design/')) {
		// Catch-all for any other antd subpath (e.g. type-only imports compiled away by tsx)
		return {
			url: 'data:text/javascript,export default {};',
			shortCircuit: true,
		};
	}

	return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
	if (ASSET_EXTENSIONS.some((ext) => url.endsWith(ext))) {
		return {
			format: 'module',
			source: 'export default {};',
			shortCircuit: true,
		};
	}
	return nextLoad(url, context);
}
