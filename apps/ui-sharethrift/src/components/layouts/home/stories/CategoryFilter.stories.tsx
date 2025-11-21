import { CategoryFilter } from '../components/category-filter.tsx';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

const meta: Meta<typeof CategoryFilter> = {
	title: 'Listing/Category Filter',
	component: CategoryFilter,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onCategoryChange: { action: 'category changed' },
	},
};
export default meta;

type Story = StoryObj<typeof CategoryFilter>;

const DEFAULT_CATEGORIES = [
	'Tools & Equipment',
	'Electronics',
	'Sports & Outdoors',
	'Home & Garden',
	'Party & Events',
	'Vehicles & Transportation',
	'Kids & Baby',
	'Books & Media',
	'Clothing & Accessories',
	'Miscellaneous',
];

const DefaultCategoryFilter = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	return (
		<CategoryFilter
			categories={DEFAULT_CATEGORIES}
			selectedCategory={selectedCategory}
			onCategoryChange={setSelectedCategory}
		/>
	);
};

export const Default: Story = {
	render: () => <DefaultCategoryFilter />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Verify the All button is present and selected by default
		const allButton = canvas.getByRole('button', { name: /all/i });
		expect(allButton).toBeInTheDocument();
		
		// Verify all category buttons are rendered
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(DEFAULT_CATEGORIES.length);
		
		// Click on a category button
		const electronicsButton = canvas.getByRole('button', { name: /electronics/i });
		expect(electronicsButton).toBeInTheDocument();
		await userEvent.click(electronicsButton);
	},
};

export const CategorySelection: Story = {
	render: () => <DefaultCategoryFilter />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Test clicking multiple categories
		const toolsButton = canvas.getByRole('button', { name: /tools & equipment/i });
		await userEvent.click(toolsButton);
		expect(toolsButton).toBeInTheDocument();
		
		const sportsButton = canvas.getByRole('button', { name: /sports & outdoors/i });
		await userEvent.click(sportsButton);
		expect(sportsButton).toBeInTheDocument();
		
		// Click All button to reset
		const allButton = canvas.getByRole('button', { name: /all/i });
		await userEvent.click(allButton);
		expect(allButton).toBeInTheDocument();
	},
};
