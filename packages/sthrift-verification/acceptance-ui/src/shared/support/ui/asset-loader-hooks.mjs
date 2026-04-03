// ESM loader hooks for intercepting CSS, image, and other asset imports
// These run in Node.js's loader thread (plain JS required, no TypeScript)

const ASSET_PATTERN = /\.(css|less|scss|sass|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|mp4|mp3)(\?.*)?$/;

// Redirect antd/es/* ESM subpaths to antd/lib/* CJS subpaths to avoid
// ERR_REQUIRE_CYCLE_MODULE errors when Node.js processes ESM/CJS transitions
const ANTD_ES_PATTERN = /^antd\/es\//;

// Track redirected antd module URLs to apply ESM→CJS default export fix in load()
const redirectedUrls = new Set();

export async function resolve(specifier, context, nextResolve) {
	if (ASSET_PATTERN.test(specifier)) {
		return {
			url: new URL(specifier, context.parentURL).href,
			shortCircuit: true,
		};
	}

	// Redirect antd/es/* to antd/lib/* for Node.js CJS/ESM compatibility
	if (ANTD_ES_PATTERN.test(specifier)) {
		const cjsPath = specifier.replace('antd/es/', 'antd/lib/');
		const resolved = await nextResolve(cjsPath, context);
		redirectedUrls.add(resolved.url);
		return resolved;
	}

	return nextResolve(specifier);
}

export async function load(url, context, nextLoad) {
	if (ASSET_PATTERN.test(url)) {
		return {
			format: 'module',
			source: 'export default {};',
			shortCircuit: true,
		};
	}

	// For antd/lib CJS modules redirected from antd/es, create ESM wrappers
	// that properly unwrap the __esModule default export convention.
	// Without this fix, `import Form from 'antd/es/form'` resolves to
	// `{ default: FormComponent }` instead of `FormComponent` directly,
	// because Node.js CJS→ESM interop wraps module.exports as-is.
	if (redirectedUrls.has(url)) {
		const filePath = url.startsWith('file://') ? new URL(url).pathname : url;
		return {
			format: 'module',
			source: [
				`import { createRequire } from 'node:module';`,
				`const require = createRequire(import.meta.url);`,
				`const mod = require(${JSON.stringify(filePath)});`,
				`export default (mod && mod.__esModule && mod.default) ? mod.default : mod;`,
			].join('\n'),
			shortCircuit: true,
		};
	}

	return nextLoad(url, context);
}
