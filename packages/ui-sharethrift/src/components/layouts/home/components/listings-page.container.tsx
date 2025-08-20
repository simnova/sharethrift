import { useState, useEffect } from 'react';
// import { useQuery } from '@apollo/client';
// import GET_ACTIVE_LISTINGS from './listings-page.container.graphql';
import { ListingsPage } from './listings-page';
import { DUMMY_LISTINGS } from './mock-listings';
import type { ItemListing } from './mock-listings';

interface ListingsPageContainerProps {
  isAuthenticated: boolean;
}

export function ListingsPageContainer({ isAuthenticated }: ListingsPageContainerProps) {
  // State for search query and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    // TODO: Fetch listings from backend. THIS IS JUST FRONTEND FILTER
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
    <ListingsPage
      isAuthenticated={isAuthenticated}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearch={handleSearch}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      listings={listings}
      currentPage={currentPage}
      pageSize={pageSize}
      totalListings={totalListings}
      onListingClick={handleListingClick}
      onPageChange={handlePageChange}
    />
  );
}