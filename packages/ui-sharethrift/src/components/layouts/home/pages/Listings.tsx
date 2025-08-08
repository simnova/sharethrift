import { useState, useMemo } from 'react';
import { Row, Col, Pagination, Empty, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../../../shared/molecules/hero-section';
import { SearchFilterBar } from '../../../shared/molecules/search-filter-bar';
import { ListingCard } from '../../../shared/molecules/listing-card';
import { mockListings, type MockListing } from '../../../../data/mockListings';
import { useAuth } from '../../../../contexts/AuthContext';

const { Title } = Typography;

const ITEMS_PER_PAGE = 8;

export default function Listings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [location, setLocation] = useState<string>('Philadelphia, PA');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter listings based on search criteria
  const filteredListings = useMemo(() => {
    return mockListings.filter((listing: MockListing) => {
      // Only show published listings
      if (listing.state !== 'Published') return false;
      
      // Filter by search term
      if (searchValue && !listing.title.toLowerCase().includes(searchValue.toLowerCase()) &&
          !listing.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (selectedCategory && selectedCategory !== 'All' && listing.category !== selectedCategory) {
        return false;
      }
      
      // Filter by location (for now, all mock data is in Philadelphia)
      if (location && !listing.location.includes(location.split(',')[0])) {
        return false;
      }
      
      return true;
    });
  }, [searchValue, selectedCategory, location]);

  // Paginate results
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleListingClick = (listingId: string) => {
    navigate(`/view-listing/${listingId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginPrompt = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - only show for logged-out users */}
      {!isAuthenticated && (
        <HeroSection 
          onSearch={handleSearch}
          searchValue={searchValue}
        />
      )}
      
      {/* Search and Filter Bar */}
      <SearchFilterBar
        searchValue={searchValue}
        selectedCategory={selectedCategory}
        location={location}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onLocationChange={handleLocationChange}
        showLocation={isAuthenticated} // Only show location filter for logged-in users
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="mb-2">
              {selectedCategory === 'All' ? "Today's Picks" : selectedCategory}
            </Title>
            <Typography.Text type="secondary">
              {filteredListings.length} items available
              {location && ` in ${location}`}
            </Typography.Text>
          </div>
          
          {!isAuthenticated && (
            <Button type="primary" size="large" onClick={handleLoginPrompt}>
              Create a Listing
            </Button>
          )}
        </div>

        {/* Listings Grid */}
        {paginatedListings.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedListings.map((listing) => (
                <Col 
                  key={listing._id}
                  xs={24} 
                  sm={12} 
                  md={8} 
                  lg={6}
                >
                  <ListingCard 
                    listing={listing} 
                    onClick={handleListingClick}
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {filteredListings.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredListings.length}
                  pageSize={ITEMS_PER_PAGE}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Empty
              description={
                <div>
                  <Typography.Title level={4}>No Listings Found</Typography.Title>
                  <Typography.Text type="secondary">
                    Try adjusting your search criteria or browse different categories.
                  </Typography.Text>
                </div>
              }
            >
              <Button type="primary" onClick={() => {
                setSearchValue('');
                setSelectedCategory('All');
                setCurrentPage(1);
              }}>
                Clear Filters
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
}
