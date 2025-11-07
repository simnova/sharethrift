import { MyListingsDashboard } from "./my-listings-dashboard.tsx";
import { useQuery } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import {
  HomeAllListingsTableContainerMyListingsAllDocument,
  HomeMyListingsDashboardContainerMyListingsRequestsCountDocument,
  ViewListingCurrentUserDocument,
  type ViewListingCurrentUserQuery,
} from "../../../../../generated.tsx";

export const MyListingsDashboardContainer: React.FC = () => {
  const { data: userData } = useQuery<ViewListingCurrentUserQuery>(
    ViewListingCurrentUserDocument
  );

  const sharerId = userData?.currentPersonalUserAndCreateIfNotExists?.id;

  const { data, loading, error } = useQuery(
    HomeAllListingsTableContainerMyListingsAllDocument,
    {
      variables: {
        page: 1,
        pageSize: 6,
        searchText: "",
        statusFilters: [],
        sorter: {
          field: "",
          order: "",
        },
      },
      fetchPolicy: "network-only",
    }
  );

  const { data: requestsCountData } = useQuery(
    HomeMyListingsDashboardContainerMyListingsRequestsCountDocument,
    {
      variables: {
        sharerId: sharerId ?? "",
      },
      skip: !sharerId,
      fetchPolicy: "network-only",
    }
  );

  const handleCreateListing = () => {
    // TODO: Navigate to listing creation page
    console.log("Navigate to create listing");
  };

  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data && sharerId}
      hasDataComponent={
        <MyListingsDashboard
          onCreateListing={handleCreateListing}
          requestsCount={requestsCountData?.myListingsRequests?.total ?? 0}
          sharerId={sharerId}
        />
      }
    />
  );
};
