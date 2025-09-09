import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RequestsTable } from './requests-table';

const GET_MY_LISTINGS_REQUESTS = gql`
  query HomeMyListingsRequestsTableContainerMyListingsRequests(
    $page: Int!
    $pageSize: Int!
    $searchText: String
    $statusFilters: [String!]
    $sorter: SorterInput
  ) {
    myListingsRequests(
      page: $page
      pageSize: $pageSize
      searchText: $searchText
      statusFilters: $statusFilters
      sorter: $sorter
    ) {
      items {
        id
        title
        image
        requestedBy
        requestedOn
        reservationPeriod
        status
      }
      total
      page
      pageSize
    }
  }
`;

export interface RequestsTableContainerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function RequestsTableContainer({ currentPage, onPageChange }: RequestsTableContainerProps) {
  const [searchText, setSearchText] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: 'ascend' | 'descend' | null;
  }>({ field: null, order: null });
  const pageSize = 6;

  const { data, loading, error } = useQuery(GET_MY_LISTINGS_REQUESTS, {
    variables: {
      page: currentPage,
      pageSize: pageSize,
      searchText: searchText,
      statusFilters: statusFilters,
      sorter: sorter.order ? sorter : null,
    },
    fetchPolicy: 'network-only', // Ensure we always fetch from the network
  });

  const requests = data?.myListingsRequests?.items ?? [];
  const total = data?.myListingsRequests?.total ?? 0;

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

  const handleAction = (action: string, requestId: string) => {
    // TODO: Implement actual actions in future PRs
    console.log(`Action: ${action}, Request ID: ${requestId}`);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <RequestsTable
      data={requests}
      searchText={searchText}
      statusFilters={statusFilters}
      sorter={sorter}
      currentPage={currentPage}
      pageSize={pageSize}
      total={total}
      onSearch={handleSearch}
      onStatusFilter={handleStatusFilter}
      onTableChange={handleTableChange}
      onPageChange={onPageChange}
      onAction={handleAction}
      loading={loading}
    />
  );
}