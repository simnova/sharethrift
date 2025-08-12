import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { HeroSection } from '../../../shared/molecules/hero-section';
import { SearchBar } from '../../../shared/molecules/search-bar';
import { CategoryFilter } from '../../../shared/molecules/category-filter';
import { ListingsGrid } from '../../../shared/organisms/listings-grid';
import { DUMMY_LISTINGS } from '../../../../data/dummy-listings';
import type { ItemListing } from '../../../../types/listing';
import styles from './Listings.module.css';

export default function Listings() {
  // TODO: Replace with real auth state from context/hooks
  const isAuthenticated = true;

  // State for search query and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      setListings(DUMMY_LISTINGS);
      setTotalListings(DUMMY_LISTINGS.length);
    };

    fetchListings();
  }, [searchQuery, selectedCategory, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleListingClick = (listing: ItemListing) => {
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

  return (
    <div>
      {/* Hero section - only shown for logged-out users */}
      {!isAuthenticated && (
        <HeroSection
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
      )}

      <div className={styles.listingsPage}>
        <div className={styles.listingsHeader}>
          {/* Search */}
          <div className={styles.searchBar}>
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
            <h1>Today's Picks</h1>
          )}

          <div className={styles.filterBar}>
            {/* Category filter */}
            <CategoryFilter
              label={"Category"}
              categories={['Electronics', 'Furniture', 'Clothing']}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            {/* TODO: Location filter */}
            <span>Philadelphia, PA · 10 mi</span>
          </div>
        </div>

        {/* Listings grid */}
        <ListingsGrid
          listings={listings}
          onListingClick={handleListingClick}
          currentPage={currentPage}
          pageSize={pageSize}
          total={totalListings}
          onPageChange={handlePageChange}
          showPagination={totalListings > pageSize}
        />
      </div>
    </div>
  );
}
