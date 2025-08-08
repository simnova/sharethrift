import { useState, useMemo } from 'react';
import { HeroSection } from '../../../shared/molecules/hero-section';
import { SearchFilterBar } from '../../../shared/molecules/search-filter-bar';
import { ListingsGrid } from '../../../shared/organisms/listings-grid';
import { DUMMY_LISTINGS, filterListings } from '../../../../data/dummy-listings';
import type { ItemListing } from '../../../../types/listing';
import styles from './Listings.module.css';

export default function Listings() {
  // TODO: Replace with real auth state from context/hooks
  const isAuthenticated = true;
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter listings based on search and category
  const filteredListings = useMemo(() => {
    return filterListings(DUMMY_LISTINGS, {
      category: selectedCategory,
      searchQuery: searchQuery,
    });
  }, [searchQuery, selectedCategory]);

  // Paginate filtered listings
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredListings.slice(startIndex, startIndex + pageSize);
  }, [filteredListings, currentPage, pageSize]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleListingClick = (listing: ItemListing) => {
    // TODO: Navigate to listing detail page
    console.log('Navigate to listing:', listing._id);
    // navigate(`/listing/${listing._id}`);
  };

  const handleCreateListing = () => {
    // TODO: Navigate to create listing page
    console.log('Navigate to create listing');
    // navigate('/create-listing');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.listingsPage}>
      {/* Hero section - only shown for logged-out users */}
      {!isAuthenticated && (
        <HeroSection
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
      )}

      {/* Search and filter bar */}
      <SearchFilterBar
        searchValue={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        onCreateListing={handleCreateListing}
        showCreateButton={isAuthenticated}
      />

      {/* Location indicator - matching the Figma design */}
      <div className={styles.locationHeader}>
        <span className={styles.locationText}>📍 Philadelphia, PA · 10 mi</span>
      </div>

      {/* Listings grid */}
      <ListingsGrid
        listings={paginatedListings}
        onListingClick={handleListingClick}
        currentPage={currentPage}
        pageSize={pageSize}
        total={filteredListings.length}
        onPageChange={handlePageChange}
        showPagination={filteredListings.length > pageSize}
      />
    </div>
  );
}
