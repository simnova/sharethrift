import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { HeroSectionContainer } from './hero-section.container';

const meta: Meta<typeof HeroSectionContainer> = {
	title: 'Containers/HeroSectionContainer',
	component: HeroSectionContainer,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof HeroSectionContainer>;

export const Default: Story = {
	args: {
		searchValue: '',
		onSearchChange: fn(),
		onSearch: fn(),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
