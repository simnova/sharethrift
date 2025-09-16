import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
	// Prevent path traversal attacks
	if (value.includes('..') || value.startsWith('/')) {
		throw new Error(`Invalid package name: ${value}`);
	}
	return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [getAbsolutePath('@storybook/addon-docs')],
	framework: {
		name: getAbsolutePath('@storybook/react-vite'),
		options: {},
	},
};
export default config;
