import { useState, useMemo } from 'react';
import { AllListingsTable } from './all-listings-table';
import { MOCK_MY_LISTINGS, type MyListing } from '../mock-data';

export function AllListingsTableContainer() {
  const [searchText, setSearchText] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: 'ascend' | 'descend' | null;
  }>({ field: null, order: null });
  const [currentPage, setCurrentPage] = useState(1);
  
  const pageSize = 6;

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = MOCK_MY_LISTINGS;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(listing =>
        statusFilters.includes(listing.status)
      );
    }

    // Apply sorting
    if (sorter.field && sorter.order) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sorter.field as keyof MyListing];
        const bValue = b[sorter.field as keyof MyListing];
        
        let comparison = 0;
        if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        return sorter.order === 'ascend' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [searchText, statusFilters, sorter]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (checkedValues: string[]) => {
    setStatusFilters(checkedValues);
    setCurrentPage(1);
  };

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    setSorter({
      field: sorter.field || null,
      order: sorter.order || null,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAction = (action: string, listingId: string) => {
    // TODO: Implement actual actions in future PRs
    console.log(`Action: ${action}, Listing ID: ${listingId}`);
  };

  const handleViewAllRequests = (listingId: string) => {
    // TODO: Open requests modal or navigate to requests view
    console.log(`View all requests for listing: ${listingId}`);
  };

  return (
    <AllListingsTable
      data={paginatedData}
      searchText={searchText}
      statusFilters={statusFilters}
      sorter={sorter}
      currentPage={currentPage}
      pageSize={pageSize}
      total={filteredAndSortedData.length}
      onSearch={handleSearch}
      onStatusFilter={handleStatusFilter}
      onTableChange={handleTableChange}
      onPageChange={handlePageChange}
      onAction={handleAction}
      onViewAllRequests={handleViewAllRequests}
    />
  );
}