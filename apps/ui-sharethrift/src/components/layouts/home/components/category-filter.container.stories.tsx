import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { CategoryFilterContainer } from './category-filter.container';

const meta: Meta<typeof CategoryFilterContainer> = {
	title: 'Containers/CategoryFilterContainer',
	component: CategoryFilterContainer,
	parameters: {
		layout: 'centered',
	},
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. This is all functional testing story.

	decorators: [
		(Story) => (
			<MemoryRouter>
				<div style={{ width: 400, padding: 20 }}>
					<Story />
				</div>
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof CategoryFilterContainer>;

export const Default: Story = {
	args: {
		selectedCategory: '',
		onCategoryChange: fn(),
	},
	play: ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
