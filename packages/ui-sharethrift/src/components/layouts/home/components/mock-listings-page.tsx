import { useState, useEffect } from 'react';
import { EnvironmentFilled } from '@ant-design/icons';
import { HeroSection } from '../components/hero-section';
import { SearchBar } from '../../../shared/molecules/search-bar';
import { CreateListingButton } from '../../../shared/atoms/create-listing-button';
import { CategoryFilter } from '../components/category-filter';
import { ListingsGrid } from '../../../shared/organisms/listings-grid';
import { DUMMY_LISTINGS } from './mock-listings';
import type { ItemListing } from './mock-listings';
import styles from './mock-listings-page.module.css';

interface MockListingsPageProps {
  isAuthenticated: boolean;
}

export function MockListingsPage({ isAuthenticated }: Readonly<MockListingsPageProps>) {
  // State for search query and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);


  useEffect(() => {
    // Filter listings by search and category
    let filtered = DUMMY_LISTINGS;
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(l => l.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setTotalListings(filtered.length);
    // Paginate
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    setListings(filtered.slice(startIdx, endIdx));
  }, [searchQuery, selectedCategory, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleListingClick = () => {
    // TODO: Navigate to listing detail page
    return null;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              <CreateListingButton></CreateListingButton>
            )}
          </div>

          {!isAuthenticated && (
            <h1 style={{ margin: '0' }}>Today's Picks</h1>
          )}

          <div className={styles.filterBar}>
            {/* Category filter */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            {/* TODO: Location filter */}
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-tertiary)', display: 'flex', alignItems: 'center' }}>
              <EnvironmentFilled style={{fontSize: '18px', marginRight: '8px'}}/>
              Philadelphia, PA · 10 mi
              </span>
          </div>
        </div>

        {/* Listings grid */}
        <div className={styles.listingsGridWrapper}>
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
    </div>
  );
}
