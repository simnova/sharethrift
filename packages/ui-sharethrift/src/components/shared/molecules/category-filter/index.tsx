import React from 'react';
import { Select } from 'antd';
import styles from './index.module.css';

const { Option } = Select;

interface CategoryFilterProps {
  label: string;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  label,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className={styles.categoryFilter}>
      <label>{`${label}: `}</label>
      <Select
        value={selectedCategory || 'All'} // Default to 'All'
        onChange={(value) => onCategoryChange(value)}
        style={{ width: 200 }}
        placeholder="Select a category"
        className={styles.categorySelect}
        suffixIcon={null}
      >
        <Option value="All">All</Option> {/* Update the value to match the default */}
        {categories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
    </div>
  );
};