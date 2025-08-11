import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import heroImage from '../../assets/hero/hero.png';
import { useState } from 'react';

export interface HeroSectionProps {
	onSearch?: (searchTerm: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
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
		<div
			className="relative w-full h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
			style={{
				backgroundImage: `url(${heroImage})`,
			}}
		>
			{/* Overlay for better text readability */}
			<div className="absolute inset-0 bg-black bg-opacity-20" />

			{/* Content */}
			<div className="relative z-10 text-center text-white px-4 max-w-2xl">
				<h1 className="text-4xl md:text-5xl font-bold mb-8">
					Wherever you are, borrow what you need.
				</h1>

				{/* Search Bar */}
				<div className="flex gap-2 max-w-lg mx-auto">
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
			</div>
		</div>
	);
}