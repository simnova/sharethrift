// ESM loader hooks for intercepting CSS, image, and other asset imports
// These run in Node.js's loader thread (plain JS required, no TypeScript)

const ASSET_PATTERN = /\.(css|less|scss|sass|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|mp4|mp3)(\?.*)?$/;

// Redirect antd/es/* ESM subpaths to antd/lib/* CJS subpaths to avoid
// ERR_REQUIRE_CYCLE_MODULE errors when Node.js processes ESM/CJS transitions
const ANTD_ES_PATTERN = /^antd\/es\//;

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
		return nextResolve(cjsPath, context);
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
	return nextLoad(url, context);
}
