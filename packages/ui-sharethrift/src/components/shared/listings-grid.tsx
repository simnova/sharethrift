import { useEffect, useState } from 'react';
import { Spin, Empty } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListingCard from './listing-card';
import type { MockListingData } from '../../utils/mock-listings-data';
import { getFilteredListings } from '../../utils/mock-listings-data';

export interface ListingsGridProps {
	searchTerm?: string;
	selectedCategory?: string;
	selectedLocation?: string;
}

export default function ListingsGrid({
	searchTerm,
	selectedCategory,
	selectedLocation,
}: ListingsGridProps) {
	const [listings, setListings] = useState<MockListingData[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	const itemsPerPage = 8;

	// Load initial listings
	useEffect(() => {
		setLoading(true);
		const initialListings = getFilteredListings({
			search: searchTerm,
			category: selectedCategory,
			location: selectedLocation,
			skip: 0,
			limit: itemsPerPage,
		});
		setListings(initialListings);
		setHasMore(initialListings.length >= itemsPerPage);
		setLoading(false);
	}, [searchTerm, selectedCategory, selectedLocation]);

	const loadMoreListings = () => {
		if (loading) return;

		setLoading(true);
		setTimeout(() => {
			// Simulate API delay
			const moreListings = getFilteredListings({
				search: searchTerm,
				category: selectedCategory,
				location: selectedLocation,
				skip: listings.length,
				limit: itemsPerPage,
			});

			if (moreListings.length === 0) {
				setHasMore(false);
			} else {
				setListings((prev) => [...prev, ...moreListings]);
			}
			setLoading(false);
		}, 500);
	};

	const handleCardClick = (listingId: string) => {
		// For now, just log the click. In a real app, this would navigate to the listing detail page
		console.log(`Navigate to listing ${listingId}`);
	};

	if (loading && listings.length === 0) {
		return (
			<div className="flex justify-center items-center py-20">
				<Spin size="large" />
			</div>
		);
	}

	if (listings.length === 0) {
		return (
			<div className="flex justify-center items-center py-20">
				<Empty
					description="No listings found"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			</div>
		);
	}

	return (
		<InfiniteScroll
			dataLength={listings.length}
			next={loadMoreListings}
			hasMore={hasMore}
			loader={
				<div className="flex justify-center py-4">
					<Spin />
				</div>
			}
			endMessage={
				<div className="text-center py-4 text-gray-500">
					No more listings to show
				</div>
			}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{listings.map((listing) => (
					<ListingCard
						key={listing.id}
						listing={listing}
						onClick={() => handleCardClick(listing.id)}
					/>
				))}
			</div>
		</InfiniteScroll>
	);
}