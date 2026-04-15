import {
	fileExists,
	getAllFiles,
	resolveSearchRoot,
	toPosixPath,
} from '../utils/source-files.js';

export function checkShareThriftPageStoryCoverage(
	config: { uiSourcePath: string },
): string[] {
	const violations: string[] = [];
	const sourceRoot = resolveSearchRoot(config.uiSourcePath);

	for (const filePath of getAllFiles(sourceRoot)) {
		const normalizedPath = toPosixPath(filePath);
		if (
			!normalizedPath.endsWith('.tsx') ||
			normalizedPath.endsWith('.stories.tsx') ||
			!normalizedPath.includes('/components/pages/') ||
			!/\/pages\/[^/]+\.tsx$/.test(normalizedPath)
		) {
			continue;
		}

		const storyPath = filePath.replace(/\.tsx$/, '.stories.tsx');
		if (!fileExists(storyPath)) {
			violations.push(
				`[${filePath}] Page component must have a sibling .stories.tsx file`,
			);
		}
	}

	return violations;
}

export function checkShareThriftContainerPlacement(
	config: { uiSourcePath: string },
): string[] {
	const violations: string[] = [];
	const sourceRoot = resolveSearchRoot(config.uiSourcePath);

	for (const filePath of getAllFiles(sourceRoot)) {
		const normalizedPath = toPosixPath(filePath);
		if (!normalizedPath.endsWith('.container.tsx')) {
			continue;
		}

		if (!normalizedPath.includes('/components/')) {
			violations.push(
				`[${filePath}] Container component must live in a components/ directory`,
			);
		}
	}

	return violations;
}

export function checkShareThriftContainerGraphqlPairing(
	config: { uiSourcePath?: string } = {},
): string[] {
	const violations: string[] = [];
	const sourceRoot = resolveSearchRoot(config.uiSourcePath ?? './src');

	for (const filePath of getAllFiles(sourceRoot)) {
		if (!filePath.endsWith('.container.graphql')) {
			continue;
		}

		const componentPath = filePath.replace(/\.container\.graphql$/, '.container.tsx');
		if (!fileExists(componentPath)) {
			violations.push(
				`[${filePath}] Container GraphQL document must have a sibling .container.tsx component`,
			);
		}
	}

	return violations;
}
