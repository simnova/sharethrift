import React from 'react';
import { Select, Spin } from 'antd';
import type { ApolloError } from '@apollo/client';
import styles from './category-filter.module.css';

const { Option } = Select;

interface CategoryFilterProps {
  label?: string;
  categories?: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  loading?: boolean;
  error?: ApolloError | null;
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
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onCategoryChange,
  loading = false,
  error = null,
}) => {
  const allCategories = ['All', ...(categories || DEFAULT_CATEGORIES)];
  const displayValue = selectedCategory || 'All';

  return (
    <div className={styles.categoryFilter}>
      <label>{`${label}: `}</label>
      <Select
        value={displayValue}
        onChange={(value) => onCategoryChange(value)}
        placeholder="Select a category"
        className={styles.categorySelect}
        suffixIcon={loading ? <Spin size="small" /> : null}
        loading={loading}
        disabled={loading || !!error}
      >
        {allCategories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
      {error && (
        <div style={{ fontSize: '12px', color: 'red', marginTop: '4px' }}>
          Failed to load categories
        </div>
      )}
    </div>
  );
};