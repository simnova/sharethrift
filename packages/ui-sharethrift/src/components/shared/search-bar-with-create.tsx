import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

export interface SearchBarWithCreateProps {
	onSearch?: (searchTerm: string) => void;
	onCreateListing?: () => void;
	showCreateButton?: boolean;
}

export default function SearchBarWithCreate({
	onSearch,
	onCreateListing,
	showCreateButton = false,
}: SearchBarWithCreateProps) {
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearch = () => {
		if (onSearch) {
			onSearch(searchTerm);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<div className="flex gap-4 items-center">
			{/* Search Input */}
			<div className="flex gap-2 flex-1">
				<Input
					size="large"
					placeholder="Search for items..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyPress={handleKeyPress}
					className="flex-1"
				/>
				<Button
					type="primary"
					size="large"
					icon={<SearchOutlined />}
					onClick={handleSearch}
					className="bg-gray-800 border-gray-800 hover:bg-gray-700"
				>
					Search
				</Button>
			</div>

			{/* Create Listing Button */}
			{showCreateButton && (
				<Button
					type="primary"
					size="large"
					icon={<PlusOutlined />}
					onClick={onCreateListing}
					className="bg-green-600 border-green-600 hover:bg-green-700 whitespace-nowrap"
				>
					Create a Listing
				</Button>
			)}
		</div>
	);
}