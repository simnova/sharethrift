import { useState, useEffect } from 'react';
import { HeroSection } from '../../../shared/molecules/hero-section';
import { SearchBar } from '../../../shared/molecules/search-bar';
import { CategoryFilter } from '../../../shared/molecules/category-filter';
import { ListingsGrid } from '../../../shared/organisms/listings-grid';
import { useActiveListings, useCategories } from '../../../../hooks/useListings';
import type { ItemListing } from '../../../../types/listing';
import styles from './Listings.module.css';

interface ListingsProps {
  loggedIn?: boolean;
}

export default function Listings({ loggedIn = true }: Readonly<ListingsProps>) {
  const isAuthenticated = loggedIn;

  // State for search query and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories from GraphQL
  const { categories } = useCategories();

  // Fetch listings from GraphQL
  const { 
    listings, 
    totalCount,
    loading: listingsLoading,
    error: listingsError,
    refetch
  } = useActiveListings({
    category: selectedCategory && selectedCategory !== 'All' ? selectedCategory : undefined,
    searchQuery: searchQuery || undefined,
    first: pageSize,
  });

  // Refetch data when search or category changes
  useEffect(() => {
    refetch();
  }, [searchQuery, selectedCategory, refetch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleListingClick = (_listing: ItemListing) => {
    // TODO: Navigate to listing detail page
    return null;
  };

  const handleCreateListing = () => {
    // TODO: Navigate to create listing page
    return null;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle loading state
  if (listingsLoading) {
    return (
      <div className={styles.listingsPage}>
        <div className={styles.loading}>Loading listings...</div>
      </div>
    );
  }

  // Handle error state
  if (listingsError) {
    return (
      <div className={styles.listingsPage}>
        <div className={styles.error}>
          Error loading listings: {listingsError.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section */}
      {!isAuthenticated && (
        <HeroSection
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
      )}
      <div className={styles.listingsPage} style={{ padding: isAuthenticated ? '36px' : '100px' }}>
        <div className={styles.listingsHeader} style={{ gap: isAuthenticated ? '36px 0' : '24px 0' }}>
          {/* Search */}
          <div className={`${styles.searchBar} ${isAuthenticated ? '' : styles.hideOnDesktop}`}>
            <SearchBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
            />
            {/* Create listing button */}
            {isAuthenticated && (
              <button
                className={styles.createListing}
                onClick={handleCreateListing}
              >
                Create a Listing
              </button>
            )}
          </div>
          <div className={styles.filterBar}>
            {/* Category filter */}
            <CategoryFilter
              label={"Category"}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            {/* TODO: Location filter */}
            <span style={{ color: 'var(--color-tertiary)' }}>Philadelphia, PA · 10 mi</span>
          </div>
        </div>

        {/* Listings grid */}
        <ListingsGrid
          listings={listings}
          onListingClick={handleListingClick}
          currentPage={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onPageChange={handlePageChange}
          showPagination={totalCount > pageSize}
        />
      </div>
    </div>
  );
}
