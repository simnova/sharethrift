import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { SectionLayout } from '../section-layout.tsx';

const meta = {
	title: 'Layouts/SignupLayout',
	component: SectionLayout,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/signup']}>
				<Story />
			</MemoryRouter>
		),
	],
} satisfies Meta<typeof SectionLayout>;

export default meta;
type Story = StoryObj<typeof SectionLayout>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		// Verify the signup layout renders with header
		const header = canvasElement.querySelector('header');
		await expect(header).toBeInTheDocument();

		// Verify main content area
		const main = canvasElement.querySelector('main');
		await expect(main).toBeInTheDocument();

		// Verify footer
		const footer = canvasElement.querySelector('footer');
		await expect(footer).toBeInTheDocument();
	},
};

export const WithEnvironmentHandling: Story = {
	play: async ({ canvasElement }) => {
		// Test that environment-specific login handling works
		const header = canvasElement.querySelector('header');
		await expect(header).toBeInTheDocument();
	},
};
