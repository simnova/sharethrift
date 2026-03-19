/**
 * ESM Loader hook for DOM testing environment.
 *
 * Routes package imports to lightweight stubs for headless DOM testing:
 * - antd / antd/es/* → stubs/antd.js (renders real HTML elements)
 * - @ant-design/icons → stubs/antd-icons.js (renders <span> stubs)
 * - react-router-dom → stubs/react-router-dom.js (no-op router context)
 * - CSS/SVG/image files → empty modules
 *
 * Acceptance tests verify user interaction flow via Screenplay pattern.
 * Stubs provide real HTML elements that @testing-library can query,
 * without pulling in antd's CSS-in-JS engine or browser-only APIs.
 */

const STUBS_DIR = new URL('./stubs/', import.meta.url).href;

const ASSET_EXTENSIONS = ['.css', '.module.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2', '.ttf', '.eot'];
const EMPTY_MODULE = 'data:text/javascript;base64,ZXhwb3J0IGRlZmF1bHQge307';

/** Map package specifiers to stub files. */
const STUB_MAP = {
	'antd':               'antd.js',
	'@ant-design/icons':  'antd-icons.js',
	'react-router-dom':   'react-router-dom.js',
};

/**
 * Map antd/es/* deep-path default imports to the named export in antd.js.
 * e.g. `import Row from 'antd/es/row'` → re-exports `Row` from antd.js
 */
const ANTD_DEEP_MAP = {
	'antd/es/row':         'Row',
	'antd/es/col':         'Col',
	'antd/es/button':      'Button',
	'antd/es/form':        'Form',
	'antd/es/input':       'Input',
	'antd/es/date-picker': 'DatePicker',
	'antd/es/message':     'message',
	'antd/es/avatar':      'Avatar',
	'antd/es/select':      'Select',
};

function makeReexportUrl(namedExport) {
	const code = `export { ${namedExport} as default, ${namedExport} } from '${STUBS_DIR}antd.js';`;
	return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
}

export function resolve(specifier, context, nextResolve) {
	// 1. CSS / asset imports → empty module
	if (ASSET_EXTENSIONS.some((ext) => specifier.endsWith(ext))) {
		return { url: EMPTY_MODULE, format: 'module', shortCircuit: true };
	}

	// 2. Exact package matches → stub file
	if (STUB_MAP[specifier]) {
		return { url: STUBS_DIR + STUB_MAP[specifier], format: 'module', shortCircuit: true };
	}

	// 3. antd/es/* deep imports → re-export the named component as default
	if (ANTD_DEEP_MAP[specifier]) {
		return { url: makeReexportUrl(ANTD_DEEP_MAP[specifier]), format: 'module', shortCircuit: true };
	}

	// 4. Any other antd/* or @ant-design/icons/* → main stub
	if (specifier.startsWith('antd/')) {
		return { url: STUBS_DIR + 'antd.js', format: 'module', shortCircuit: true };
	}
	if (specifier.startsWith('@ant-design/icons/')) {
		return { url: STUBS_DIR + 'antd-icons.js', format: 'module', shortCircuit: true };
	}

	// 5. Everything else → normal resolution
	return nextResolve(specifier, context);
}
