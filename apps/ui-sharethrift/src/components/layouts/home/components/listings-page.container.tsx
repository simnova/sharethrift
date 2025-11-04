import { useQuery } from '@apollo/client/react';
import {
	ComponentQueryLoader,
	type UIItemListing,
} from '@sthrift/ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ListingsPageContainerGetListingsDocument,
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
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;
	const [selectedCategory, setSelectedCategory] = useState('');
	const { data, loading, error } = useQuery(
		ListingsPageContainerGetListingsDocument,
		{
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
		},
	);

	const filteredListings = data?.itemListings
		? data.itemListings.filter((listing) => {
				if (
					selectedCategory &&
					selectedCategory !== 'All' &&
					listing.category !== selectedCategory
				) {
					return false;
				}
				if (
					searchQuery &&
					!listing.title.toLowerCase().includes(searchQuery.toLowerCase())
				) {
					return false;
				}
				return true;
			})
		: [];

	const totalListings = filteredListings.length;
	const startIdx = (currentPage - 1) * pageSize;
	const endIdx = startIdx + pageSize;
	const currentListings = filteredListings.slice(startIdx, endIdx);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
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

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.itemListings}
			hasDataComponent={
				<ListingsPage
					isAuthenticated={isAuthenticated}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onSearch={handleSearch}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
					listings={currentListings.map(
						(listing): ItemListing => ({
							listingType: 'item-listing',
							id: String(listing.id),
							title: listing.title,
							description: listing.description,
							category: listing.category,
							location: listing.location,
							state: (listing.state as ItemListing['state']) || undefined,
							images: listing.images ?? [],
							sharingPeriodStart: new Date(
								listing.sharingPeriodStart as unknown as string,
							),
							sharingPeriodEnd: new Date(
								listing.sharingPeriodEnd as unknown as string,
							),
							createdAt: listing.createdAt
								? new Date(listing.createdAt as unknown as string)
								: undefined,
							updatedAt: listing.updatedAt
								? new Date(listing.updatedAt as unknown as string)
								: undefined,
						}),
					)}
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
