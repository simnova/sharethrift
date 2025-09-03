import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AllListingsTable } from './all-listings-table';

const GET_MY_LISTINGS = gql`
  query MyListingsAll(
    $page: Int!
    $pageSize: Int!
    $searchText: String
    $statusFilters: [String!]
    $sorter: SorterInput
  ) {
    myListingsAll(
      page: $page
      pageSize: $pageSize
      searchText: $searchText
      statusFilters: $statusFilters
      sorter: $sorter
    ) {
      listings {
        id
        title
        status
        sharedCount
        requestsCount
        createdAt
      }
      total
    }
  }
`;

export function AllListingsTableContainer({ currentPage, onPageChange }: { currentPage: number, onPageChange: (page: number) => void }) {
  const [searchText, setSearchText] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: 'ascend' | 'descend' | null;
  }>({ field: null, order: null });
  const pageSize = 6;

  const { data, loading, error } = useQuery(GET_MY_LISTINGS, {
    variables: {
      page: currentPage,
      pageSize: pageSize,
      searchText: searchText,
      statusFilters: statusFilters,
      sorter: sorter,
    },
  });

  console.log("------->>>>>>>-----", data);
  // Filter and sort data - this is now handled by the backend
  const listings = data ? data.myListingsAll.listings : [];
  const total = data ? data.myListingsAll.total : 0;

  const handleSearch = (value: string) => {
    setSearchText(value);
    onPageChange(1);
  };

  const handleStatusFilter = (checkedValues: string[]) => {
    setStatusFilters(checkedValues);
    onPageChange(1);
  };

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    setSorter({
      field: sorter.field || null,
      order: sorter.order || null,
    });
    onPageChange(1);
  };

  // Use the passed onPageChange prop
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handleAction = (action: string, listingId: string) => {
    // TODO: Implement actual actions in future PRs
    console.log(`Action: ${action}, Listing ID: ${listingId}`);
  };

  const handleViewAllRequests = (listingId: string) => {
    // TODO: Open requests modal or navigate to requests view
    console.log(`View all requests for listing: ${listingId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <AllListingsTable
      data={listings}
      searchText={searchText}
      statusFilters={statusFilters}
      sorter={sorter}
      currentPage={currentPage}
      pageSize={pageSize}
      total={total}
      onSearch={handleSearch}
      onStatusFilter={handleStatusFilter}
      onTableChange={handleTableChange}
      onPageChange={handlePageChange}
      onAction={handleAction}
      onViewAllRequests={handleViewAllRequests}
    />
  );
}