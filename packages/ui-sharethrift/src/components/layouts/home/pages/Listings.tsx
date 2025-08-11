import { useState } from 'react';
import HeroSection from '../../../shared/hero-section';
import SearchBarWithCreate from '../../../shared/search-bar-with-create';
import Filters from '../../../shared/filters';
import ListingsGrid from '../../../shared/listings-grid';

export default function Listings() {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [selectedLocation, setSelectedLocation] = useState('');

	// For now, we'll test the logged-out hero view 
	// In a real app, this would come from authentication context
	const isLoggedIn = false;

	const handleSearch = (term: string) => {
		setSearchTerm(term);
	};

	const handleCreateListing = () => {
		// For now, just log the action. In a real app, this would navigate to create listing page
		console.log('Navigate to create listing page');
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	const handleLocationChange = (location: string) => {
		setSelectedLocation(location);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section - only show for logged-out users */}
			{!isLoggedIn && <HeroSection onSearch={handleSearch} />}

			{/* Main Content */}
			<div className="container mx-auto px-4 py-6">
				{/* Search Bar and Create Button - for logged-in users */}
				{isLoggedIn && (
					<div className="mb-6">
						<SearchBarWithCreate
							onSearch={handleSearch}
							onCreateListing={handleCreateListing}
							showCreateButton={isLoggedIn}
						/>
					</div>
				)}

				{/* Filters */}
				<div className="mb-6">
					<Filters
						selectedCategory={selectedCategory}
						selectedLocation={selectedLocation}
						onCategoryChange={handleCategoryChange}
						onLocationChange={handleLocationChange}
					/>
				</div>

				{/* Listings Grid */}
				<ListingsGrid
					searchTerm={searchTerm}
					selectedCategory={selectedCategory}
					selectedLocation={selectedLocation}
				/>
			</div>
		</div>
	);
}
