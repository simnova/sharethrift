import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { MockAuthWrapper } from '../../../test-utils/storybook-decorators.tsx';
import { AuthRedirectUser } from '../auth-redirect-user.tsx';

const meta: Meta<typeof AuthRedirectUser> = {
	title: 'Shared/AuthRedirectUser',
	component: AuthRedirectUser,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MockAuthWrapper>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</MockAuthWrapper>
		),
	],
};

export default meta;
type Story = StoryObj<typeof AuthRedirectUser>;

export const Authenticated: Story = {
	play: ({ canvasElement }) => {
		// When authenticated via MockAuthWrapper, component renders without error
		expect(canvasElement).toBeTruthy();
	},
};
