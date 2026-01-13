import type { Preview } from '@storybook/react-vite';
import "@sthrift/ui-components/src/styles/theme.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'todo',
		},
		options: {
			storySort: {
				order: [
					'Pages', 
            ['Signup', ['Select Account Type', 'Account Setup', 'Profile Setup', 'Terms', 'Payment']],
					'Components',
          'Containers'
				],
			},
		},
	},
};

export default preview;
