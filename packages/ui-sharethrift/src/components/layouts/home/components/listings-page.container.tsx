import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { ListingsPage } from './listings-page';
import type { ItemListing } from './mock-listings';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ListingsPageQuerySource from './listings-page.container.graphql?raw';

type ItemListingState = 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';

interface GraphQLItemListing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  state: ItemListingState;
  images: string[];
  createdAt: string;
  updatedAt: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
  sharer: string;
  schemaVersion: string;
  version: number;
  reports: number;
  sharingHistory: string[];
}

interface ListingsQueryData {
  itemListings: GraphQLItemListing[];
}

const GET_LISTINGS = gql(ListingsPageQuerySource);

interface ListingsPageContainerProps {
  isAuthenticated: boolean;
}

export function ListingsPageContainer({ isAuthenticated }: ListingsPageContainerProps) {
  // State for search query and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [selectedCategory, setSelectedCategory] = useState('');
  const { data, loading, error } = useQuery<ListingsQueryData>(GET_LISTINGS);
  
  const filteredListings = data?.itemListings ? data.itemListings
    .filter((listing: GraphQLItemListing) => {
      if (selectedCategory && selectedCategory !== 'All') {
        if (listing.category !== selectedCategory) return false;
      }
      if (searchQuery) {
        if (!listing.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    }) : [];

  const totalListings = filteredListings.length;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentListings = filteredListings.slice(startIdx, endIdx);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const navigate = useNavigate();
  const handleListingClick = (listing: ItemListing) => {
    navigate(`/listing/${listing._id}`);
  };

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

  if (error) return <div>Error loading listings</div>;
  if (loading) return <div>Loading listings...</div>;

  return (
    <ListingsPage
      isAuthenticated={isAuthenticated}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearch={handleSearch}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      listings={currentListings.map((listing: GraphQLItemListing): ItemListing => ({
        _id: listing.id,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        location: listing.location,
        state: listing.state,
        images: listing.images,
        sharingPeriodStart: new Date(listing.sharingPeriodStart),
        sharingPeriodEnd: new Date(listing.sharingPeriodEnd),
        sharer: listing.sharer,
        createdAt: new Date(listing.createdAt),
        updatedAt: new Date(listing.updatedAt)
      }))}
      currentPage={currentPage}
      pageSize={pageSize}
      totalListings={totalListings}
      onListingClick={handleListingClick}
      onPageChange={handlePageChange}
    />
  );
}