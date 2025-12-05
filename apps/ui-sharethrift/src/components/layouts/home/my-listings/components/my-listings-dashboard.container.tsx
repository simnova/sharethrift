import { useQuery } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import {
  HomeAllListingsTableContainerMyListingsAllDocument,
  HomeMyListingsDashboardContainerMyListingsRequestsCountDocument,
  ViewListingCurrentUserDocument,
  type ViewListingCurrentUserQuery,
} from "../../../../../generated.tsx";
import { MyListingsDashboard } from "./my-listings-dashboard.tsx";

export const MyListingsDashboardContainer: React.FC = () => {
  const { data: userData, loading: userLoading } =
    useQuery<ViewListingCurrentUserQuery>(ViewListingCurrentUserDocument);

  const sharerId = userData?.currentUser?.id;

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

  // Wait for user data to load before rendering
  if (userLoading || !sharerId) {
    return (
      <ComponentQueryLoader
        loading={true}
        error={undefined}
        hasData={null}
        hasDataComponent={<></>}
      />
    );
  }

  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data ?? null}
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
