import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthRedirectUser } from '../auth-redirect-user.tsx';
import { MockAuthWrapper } from '../../../test-utils/storybook-mock-auth-wrappers.tsx';

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
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof AuthRedirectUser>;

export const Authenticated: Story = {
	play: ({ canvasElement }) => {
		// When authenticated via MockAuthWrapper, component renders without error
		expect(canvasElement).toBeTruthy();
	},
};
