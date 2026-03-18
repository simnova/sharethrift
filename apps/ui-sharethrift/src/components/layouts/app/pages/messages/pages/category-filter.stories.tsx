import { CategoryFilter } from '../../home/components/category-filter';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

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
};

export const CategorySelection: Story = {
	render: () => <DefaultCategoryFilter />,
};
