import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { AllListingsTable } from "./all-listings-table.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { HomeAllListingsTableContainerMyListingsAllDocument, HomeAllListingsTableContainerCancelItemListingDocument, HomeAllListingsTableContainerDeleteListingDocument } from "../../../../../generated.tsx";
import { message } from "antd";

export interface AllListingsTableContainerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const AllListingsTableContainer: React.FC<AllListingsTableContainerProps> = ({
  currentPage,
  onPageChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: "ascend" | "descend" | null;
  }>({ field: null, order: null });
  const pageSize = 6;

  const { data, loading, error, refetch } = useQuery(
    HomeAllListingsTableContainerMyListingsAllDocument,
    {
      variables: {
        page: currentPage,
        pageSize: pageSize,
        searchText: searchText,
        statusFilters: statusFilters,
        sorter:
          sorter.field && sorter.order
            ? { field: sorter.field, order: sorter.order }
            : undefined,
      },
      fetchPolicy: "network-only",
    }
  );

  const [cancelListing] = useMutation(HomeAllListingsTableContainerCancelItemListingDocument, {
    onCompleted: () => {
      message.success("Listing cancelled successfully");
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to cancel listing: ${error.message}`);
    },
  });

  const [deleteListing] = useMutation(HomeAllListingsTableContainerDeleteListingDocument, {
    onCompleted: () => {
      message.success("Listing deleted successfully");
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete listing: ${error.message}`);
    },
  });

  const listings = data?.myListingsAll?.items ?? [];
  const total = data?.myListingsAll?.total ?? 0;

  // Transform domain fields to UI format
  const transformedListings = listings.map(listing => {
    const startDate = listing.sharingPeriodStart ?? '';
    const endDate = listing.sharingPeriodEnd ?? '';
    const reservationPeriod = startDate && endDate 
      ? `${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}` 
      : '';

    return {
      id: listing.id,
      title: listing.title,
      image: listing.images?.[0] ?? null,
      publishedAt: listing.createdAt ?? null,
      reservationPeriod,
      status: listing.state ?? 'Unknown',
      pendingRequestsCount: 0, // TODO: implement in future
    };
  });

  const handleSearch = (value: string) => {
    setSearchText(value);
    onPageChange(1);
  };

  const handleStatusFilter = (checkedValues: string[]) => {
    setStatusFilters(checkedValues);
    onPageChange(1);
  };

  const handleTableChange = (
    _pagination: unknown,
    _filters: unknown,
    sorter: unknown
  ) => {
    const typedSorter = sorter as {
      field?: string;
      order?: "ascend" | "descend";
    };
    setSorter({
      field: typedSorter.field || null,
      order: typedSorter.order || null,
    });
    onPageChange(1);
  };

  const handleAction = async (action: string, listingId: string) => {
    if (action === "cancel") {
      await cancelListing({ variables: { id: listingId } });
    } else if (action === "delete") {
      await deleteListing({ variables: { id: listingId } });
    } else {
      message.info(`Action "${action}" for listing ${listingId} coming soon.`);
    }
  };

  const handleViewAllRequests = (listingId: string) => {
    // TODO: Open requests modal or navigate to requests view
    console.log(`View all requests for listing: ${listingId}`);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data?.myListingsAll}
      hasDataComponent={
        <AllListingsTable
          data={transformedListings}
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
      }
    />
  );
}
