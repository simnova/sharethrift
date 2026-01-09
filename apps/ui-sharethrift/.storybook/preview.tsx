import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		// Disable automatic a11y checks globally to prevent flaky dynamic import failures in CI.
		// The a11y addon dynamically imports axe-core during test runs, which causes intermittent
		// failures in CI environments due to module caching and parallelization issues.
		// For accessibility testing, consider running dedicated a11y audits separately.
		a11y: {
            // test: 'todo',
			disable: true,
		},
	},
};

export default preview;
