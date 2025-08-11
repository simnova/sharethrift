import { Select, Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { categories } from '../../utils/mock-listings-data';

export interface FiltersProps {
	selectedCategory?: string;
	selectedLocation?: string;
	onCategoryChange?: (category: string) => void;
	onLocationChange?: (location: string) => void;
}

export default function Filters({
	selectedCategory = 'All',
	selectedLocation,
	onCategoryChange,
	onLocationChange,
}: FiltersProps) {
	return (
		<div className="flex gap-4 items-center">
			{/* Category Filter */}
			<div className="flex items-center gap-2">
				<span className="text-gray-600 whitespace-nowrap">Category:</span>
				<Select
					value={selectedCategory}
					onChange={onCategoryChange}
					size="large"
					style={{ minWidth: 200 }}
					options={categories.map((category) => ({
						label: category,
						value: category,
					}))}
				/>
			</div>

			{/* Location Filter */}
			<div className="flex items-center gap-2">
				<Button
					size="large"
					icon={<EnvironmentOutlined />}
					onClick={() => onLocationChange?.('Philadelphia, PA - 10 mi')}
					className="flex items-center gap-2"
				>
					Philadelphia, PA - 10 mi
				</Button>
			</div>
		</div>
	);
}