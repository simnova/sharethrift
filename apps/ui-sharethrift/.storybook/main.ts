import type { StorybookConfig } from '@storybook/react-vite';
import type { InlineConfig } from 'vite';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function getAbsolutePath(value: string): string {
	// Prevent path traversal attacks
	if (value.includes('..') || value.startsWith('/')) {
		throw new Error(`Invalid package name: ${value}`);
	}
	return dirname(fileURLToPath(import.meta.resolve(value)));
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
	typescript: {
		check: true,
		reactDocgen: 'react-docgen-typescript',
	},
	// Vite configuration to fix dynamic import issues in CI
	viteFinal: async (config: InlineConfig) => {
		// Deduplicate React to prevent multiple instances causing module resolution issues
		config.resolve = config.resolve || {};
		config.resolve.dedupe = ['react', 'react-dom'];
		
		// Optimize dependency pre-bundling for Storybook tests
		config.optimizeDeps = {
			...config.optimizeDeps,
			include: [
				...(config.optimizeDeps?.include || []),
				'react',
				'react-dom',
				'react-dom/client',
				'react/jsx-runtime',
			],
		};
		
		return config;
	},
};
export default config;
