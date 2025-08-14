import { useState } from 'react';
import { Button } from 'antd';
import { HeroSection } from '../components/hero-section';
import { SearchBar } from '../../../shared/molecules/search-bar';
import { CategoryFilter } from '../components/category-filter';
import { ListingsGrid } from '../../../shared/organisms/listings-grid';
import { useActiveListings, useCategories } from '../../../../hooks/useListings';
import type { ItemListing } from '../../../../types/listing';
import styles from './Listings.module.css';

interface ListingsProps {
  loggedIn?: boolean;
}

export default function Listings({ loggedIn = false }: Readonly<ListingsProps>) {
  const isAuthenticated = loggedIn;

  // State for search query and category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // GraphQL queries using custom hooks
  const { 
    listings,
    loading: listingsLoading, 
    error: listingsError,
    totalCount,
    hasNextPage,
    loadMore,
    refetch
  } = useActiveListings({
    category: selectedCategory || undefined,
    searchQuery: searchQuery || undefined,
    first: 12
  });

  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'All' ? '' : category);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !listingsLoading && loadMore) {
      loadMore();
    }
  };

  const handleListingClick = (_listing: ItemListing) => {
    // TODO: Navigate to listing detail page
    return null;
  };

  const handleCreateListing = () => {
    // TODO: Navigate to create listing page
    return null;
  };

  // Show loading state
  if (listingsLoading && !listings.length) {
    return (
      <div>
        {!isAuthenticated && (
          <HeroSection
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
          />
        )}
        <div className={styles.listingsPage} style={{ padding: isAuthenticated ? '36px' : '100px' }}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Loading listings...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (listingsError) {
    return (
      <div>
        {!isAuthenticated && (
          <HeroSection
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
          />
        )}
        <div className={styles.listingsPage} style={{ padding: isAuthenticated ? '36px' : '100px' }}>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            Error loading listings: {listingsError.message}
          </div>
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
              <Button
                className={styles.createListing}
                onClick={handleCreateListing}
                type="primary"
              >
                Create a Listing
              </Button>
            )}
          </div>

          {!isAuthenticated && (
            <h1 style={{ margin: '0' }}>Today's Picks</h1>
          )}

          <div className={styles.filterBar}>
            {/* Category filter */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories || []}
              loading={categoriesLoading}
              error={categoriesError}
            />
            {/* TODO: Location filter */}
            <span style={{ color: 'var(--color-tertiary)' }}>Philadelphia, PA · 10 mi</span>
          </div>
        </div>

        {/* Listings grid */}
        <div className={styles.listingsGridWrapper}>
          <ListingsGrid
            listings={listings}
            onListingClick={handleListingClick}
            loading={listingsLoading}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMore}
            totalCount={totalCount}
          />
          
          {/* Show total count */}
          {totalCount > 0 && (
            <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-tertiary)' }}>
              Showing {listings.length} of {totalCount} listings
            </div>
          )}
          
          {/* Show empty state */}
          {!listingsLoading && listings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h3>No listings found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
