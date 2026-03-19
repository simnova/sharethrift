// Global preview for Storybook in @sthrift/ui-components
// Import Ant Design base styles so components render correctly
import type { Decorator, Parameters } from '@storybook/react';
import { AuthProvider } from 'react-oidc-context';
import { MemoryRouter } from 'react-router-dom';
import 'antd/dist/reset.css';

// Global MemoryRouter so any Link/useLocation has context
export const decorators: Decorator[] = [
	(Story, context) => {
		const initialEntries = context.parameters?.memoryRouter?.initialEntries ?? [
			'/',
		];

		return (
			<AuthProvider>
				<MemoryRouter initialEntries={initialEntries}>
					<Story />
				</MemoryRouter>
			</AuthProvider>
		);
	},
];

// Global parameters
export const parameters: Parameters = {
	layout: 'padded',
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/i,
		},
	},
};
