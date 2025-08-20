import { useState, useMemo } from 'react';
import { RequestsTable } from './requests-table';
import { MOCK_LISTING_REQUESTS, type ListingRequest } from '../mock-data';

export function RequestsTableContainer() {
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
    let filtered = MOCK_LISTING_REQUESTS;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(request =>
        request.listing.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(request =>
        statusFilters.includes(request.status)
      );
    }

    // Apply sorting
    if (sorter.field && sorter.order) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        if (sorter.field === 'requestedBy') {
          aValue = a.requestedBy;
          bValue = b.requestedBy;
        } else if (sorter.field === 'requestedOn') {
          aValue = a.requestedOn;
          bValue = b.requestedOn;
        } else if (sorter.field === 'reservationPeriodStart') {
          aValue = a.reservationPeriodStart;
          bValue = b.reservationPeriodStart;
        } else {
          aValue = a[sorter.field as keyof ListingRequest];
          bValue = b[sorter.field as keyof ListingRequest];
        }
        
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

  const handleAction = (action: string, requestId: string) => {
    // TODO: Implement actual actions in future PRs
    console.log(`Action: ${action}, Request ID: ${requestId}`);
  };

  return (
    <RequestsTable
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
    />
  );
}