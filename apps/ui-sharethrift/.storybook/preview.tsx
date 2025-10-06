import type { Preview } from '@storybook/react-vite';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloManualMergeCacheFix } from '../src/components/shared/apollo-manual-merge-cache-fix.ts';

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

        apolloClient: {
            MockedProvider, 
            cache: ApolloManualMergeCacheFix
        },
	},
};

export default preview;
