import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { SectionLayout } from './section-layout.tsx';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {  withMockApolloClient } from '../../../test-utils/storybook-decorators.tsx';
import { MockAuthWrapper } from '../../../test-utils/storybook-mock-auth-wrappers.tsx';

const meta: Meta<typeof SectionLayout> = {
	title: 'Layouts/SectionLayout',
	component: SectionLayout,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		withMockApolloClient,
		(Story) => (
			<MockAuthWrapper>
				<MemoryRouter initialEntries={['/signup']}>
					<Routes>
						<Route path="/signup" element={<Story />}>
							<Route index element={<div>Signup Content</div>} />
						</Route>
					</Routes>
				</MemoryRouter>
			</MockAuthWrapper>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SectionLayout>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		await expect(canvas.getByText('Signup Content')).toBeInTheDocument();
	},
};

export const ClickHeaderButtons: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const loginButtons = canvas.queryAllByRole('button', { name: /Log In/i });
		const firstButton = loginButtons[0];
		if (firstButton) {
			await userEvent.click(firstButton);
		}
	},
};

export const ClickCreateListing: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const shareButton = canvas.queryByRole('button', { name: /Share/i });
		if (shareButton) {
			await userEvent.click(shareButton);
		}
	},
};
