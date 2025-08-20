// import { useQuery } from '@apollo/client';
// import GET_CATEGORIES from './category-filter.container.graphql';
import { CategoryFilter } from './category-filter';

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

export function CategoryFilterContainer({ 
  selectedCategory, 
  onCategoryChange, 
  label = "Category" 
}: CategoryFilterContainerProps) {
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