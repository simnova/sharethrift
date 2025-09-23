import React from 'react';
import { Select } from 'antd';
import styles from './category-filter.module.css';

const { Option } = Select;

interface CategoryFilterProps {
	label?: string;
	categories: string[];
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
	label = 'Category',
	categories,
	selectedCategory,
	onCategoryChange,
}) => {
	return (
		<div className={styles['categoryFilter']}>
			<label htmlFor="category-filter-select">{`${label}: `}</label>
			<Select
				id="category-filter-select"
				value={selectedCategory || 'All'} // Default to 'All'
				onChange={(value) => onCategoryChange(value)}
				placeholder="Select a category"
				className={styles['categorySelect']}
				suffixIcon={null}
			>
				<Option key={'All'} value="All">
					All
				</Option>
				{categories.map((category) => (
					<Option key={category} value={category}>
						{category}
					</Option>
				))}
			</Select>
		</div>
	);
};
