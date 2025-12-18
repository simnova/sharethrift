import { useQuery } from '@apollo/client/react';
import {
	ComponentQueryLoader,
	type UIItemListing,
} from '@sthrift/ui-components';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ListingsPageContainerGetListingsDocument,
	ListingsPageSearchItemListingsDocument,
	type ItemListing,
} from '../../../../generated.tsx';
import { useCreateListingNavigation } from './create-listing/hooks/use-create-listing-navigation.ts';
import { ListingsPage } from './listings-page.tsx';

interface ListingsPageContainerProps {
	isAuthenticated: boolean;
}

export const ListingsPageContainer: React.FC<ListingsPageContainerProps> = ({
	isAuthenticated,
}) => {
	const [searchInputValue, setSearchInputValue] = useState(''); // What user types
	const [searchQuery, setSearchQuery] = useState(''); // Actual search query executed
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;
	const [selectedCategory, setSelectedCategory] = useState('');

	// Determine if we should use search query or get all listings
	const shouldUseSearch = Boolean(searchQuery || (selectedCategory && selectedCategory !== 'All'));

	// Prepare search input
	const searchInput = useMemo(() => ({
		searchString: searchQuery || undefined,
		options: {
			filter: {
				category: (selectedCategory && selectedCategory !== 'All') ? [selectedCategory] : undefined,
			},
			skip: (currentPage - 1) * pageSize,
			top: pageSize,
		},
	}), [searchQuery, selectedCategory, currentPage, pageSize]);

	// Query all listings (when no search/filter)
	const { data: allListingsData, loading: allListingsLoading, error: allListingsError } = useQuery(
		ListingsPageContainerGetListingsDocument,
		{
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
			skip: shouldUseSearch,
		},
	);

	// Query search results (when searching/filtering)
	const { data: searchData, loading: searchLoading, error: searchError } = useQuery(
		ListingsPageSearchItemListingsDocument,
		{
			variables: { input: searchInput },
			fetchPolicy: 'network-only',
			skip: !shouldUseSearch,
		},
	);

	// Combine results based on which query is active
	const loading = shouldUseSearch ? searchLoading : allListingsLoading;
	const error = shouldUseSearch ? searchError : allListingsError;

	// Process listings based on which query is active
	const { listings: processedListings, totalListings } = useMemo(() => {
		if (shouldUseSearch && searchData?.searchItemListings) {
			// Use search results
			return {
				listings: searchData.searchItemListings.items,
				totalListings: searchData.searchItemListings.count,
			};
		}
		
		// Use all listings with client-side pagination
		const allListings = allListingsData?.itemListings || [];
		const startIdx = (currentPage - 1) * pageSize;
		const endIdx = startIdx + pageSize;
		return {
			listings: allListings.slice(startIdx, endIdx),
			totalListings: allListings.length,
		};
	}, [shouldUseSearch, searchData, allListingsData, currentPage, pageSize]);

	const handleSearchChange = (value: string) => {
		setSearchInputValue(value);
	};

	const handleSearch = () => {
		setSearchQuery(searchInputValue);
		setCurrentPage(1); // Reset to first page when searching
	};

	const navigate = useNavigate();
	const handleListingClick = (listing: UIItemListing) => {
		navigate(`/listing/${listing.id}`);
	};

	const handleCreateListingClick = useCreateListingNavigation();

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setTimeout(() => {
			const content = document.getElementById('listings-content');
			if (content) {
				window.scrollTo({ top: content.offsetTop - 50, behavior: 'smooth' });
			}
		}, 100);
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		setCurrentPage(1); // Reset to first page when changing category
	};

	// Map the listings to the format expected by the UI component
	const mappedListings = processedListings.map((listing): ItemListing => ({
		listingType: 'item-listing',
		id: String(listing.id),
		title: listing.title,
		description: listing.description,
		category: listing.category,
		location: listing.location,
		state: (listing.state as ItemListing['state']) || undefined,
		images: listing.images ?? [],
		sharingPeriodStart: new Date(listing.sharingPeriodStart as unknown as string),
		sharingPeriodEnd: new Date(listing.sharingPeriodEnd as unknown as string),
		createdAt: listing.createdAt
			? new Date(listing.createdAt as unknown as string)
			: undefined,
		updatedAt: listing.updatedAt
			? new Date(listing.updatedAt as unknown as string)
			: undefined,
	}));

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={mappedListings}
			hasDataComponent={
				<ListingsPage
					isAuthenticated={isAuthenticated}
					searchQuery={searchInputValue}
					onSearchChange={handleSearchChange}
					onSearch={handleSearch}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
					listings={mappedListings}
					currentPage={currentPage}
					pageSize={pageSize}
					totalListings={totalListings}
					onListingClick={handleListingClick}
					onPageChange={handlePageChange}
					onCreateListingClick={handleCreateListingClick}
				/>
			}
		/>
	);
};
