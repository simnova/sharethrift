import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AllListingsTable } from './all-listings-table';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import AllListingsTableQuerySource from './all-listings-table.container.graphql?raw';

const GET_MY_LISTINGS_ALL = gql(AllListingsTableQuerySource);

export interface AllListingsTableContainerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function AllListingsTableContainer({ currentPage, onPageChange }: AllListingsTableContainerProps) {
  const [searchText, setSearchText] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: 'ascend' | 'descend' | null;
  }>({ field: null, order: null });
  const pageSize = 6;

  const { data, loading, error } = useQuery(GET_MY_LISTINGS_ALL, {
    variables: {
      page: currentPage,
      pageSize: pageSize,
      searchText: searchText,
      statusFilters: statusFilters,
      sorter: (sorter.field && sorter.order) ? sorter : null,
    },
    fetchPolicy: 'network-only', // Ensure we always fetch from the network
  });

  const listings = data?.myListingsAll?.items ?? [];
  const total = data?.myListingsAll?.total ?? 0;

  const handleSearch = (value: string) => {
    setSearchText(value);
    onPageChange(1);
  };

  const handleStatusFilter = (checkedValues: string[]) => {
    setStatusFilters(checkedValues);
    onPageChange(1);
  };

  const handleTableChange = (_pagination: unknown, _filters: unknown, sorter: unknown) => {
    const typedSorter = sorter as { field?: string; order?: 'ascend' | 'descend' };
    setSorter({
      field: typedSorter.field || null,
      order: typedSorter.order || null,
    });
    onPageChange(1);
  };

  const handleAction = (action: string, listingId: string) => {
    // TODO: Implement actual actions in future PRs
    console.log(`Action: ${action}, Listing ID: ${listingId}`);
  };

  const handleViewAllRequests = (listingId: string) => {
    // TODO: Open requests modal or navigate to requests view
    console.log(`View all requests for listing: ${listingId}`);
  };

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
      onPageChange={onPageChange}
      onAction={handleAction}
      onViewAllRequests={handleViewAllRequests}
      loading={loading}
    />
  );
}