import React from 'react';
import { Select } from 'antd';
import styles from './category-filter.module.css';

const { Option } = Select;

interface CategoryFilterProps {
  label?: string;
  categories?: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
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

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  label = "Category",
  categories = DEFAULT_CATEGORIES, // Use default categories if none are provided
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className={styles.categoryFilter}>
      <label>{`${label}: `}</label>
      <Select
        value={selectedCategory || 'All'} // Default to 'All'
        onChange={(value) => onCategoryChange(value)}
        placeholder="Select a category"
        className={styles.categorySelect}
        suffixIcon={null}
      >
        <Option key={"All"} value="All">All</Option>
        {categories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
    </div>
  );
};