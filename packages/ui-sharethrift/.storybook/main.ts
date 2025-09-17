import type { StorybookConfig } from '@storybook/react-vite';

import { dirname } from 'path';

function getAbsolutePath(value: string): string {
	// Reject path traversal and absolute paths
	if (
		value.includes('..') ||
		value.includes('/') ||
		value.includes('\\') ||
		value.startsWith('.') ||
		value.startsWith('/') ||
		value.trim() === ''
	) {
		throw new Error(`Invalid package name: ${value}`);
	}
	// Optionally, validate npm package name (scoped or unscoped)
	const npmNameRegex = /^(?:@[\w-]+\/)?[\w-]+$/;
	if (!npmNameRegex.test(value)) {
		throw new Error(`Invalid npm package name: ${value}`);
	}
	return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
	stories: [
		'../stories/**/*.mdx',
		'../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../src/**/*.stories.@(js|jsx|ts|tsx)',
		'../packages/**/*.stories.@(js|jsx|ts|tsx)',
	],
	// Serve static assets (images) from the public directory for Storybook
	staticDirs: ['../public'],
	addons: [
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-docs'),
		getAbsolutePath('@storybook/addon-a11y'),
		getAbsolutePath('@storybook/addon-vitest'),
	],
	framework: {
		name: getAbsolutePath('@storybook/react-vite'),
		options: {},
	},
};
export default config;
