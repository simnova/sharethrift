import { CategoryFilter } from './category-filter.tsx';

interface CategoryFilterContainerProps {
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	label?: string;
}

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

export const CategoryFilterContainer: React.FC<CategoryFilterContainerProps> = ({
	selectedCategory,
	onCategoryChange,
	label = 'Category',
}) => {
	// TODO: Replace with real GraphQL query when backend is ready
	const categories = DEFAULT_CATEGORIES;

	return (
		<CategoryFilter
			label={label}
			categories={categories}
			selectedCategory={selectedCategory}
			onCategoryChange={onCategoryChange}
		/>
	);
}
