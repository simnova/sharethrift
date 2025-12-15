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

  const currentUser = userData?.currentUser;
  const sharerId = currentUser?.id;

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
      skip: !sharerId,
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

  // State 1: Loading user authentication state
  if (userLoading) {
    return (
      <ComponentQueryLoader
        loading={true}
        error={undefined}
        hasData={null}
        hasDataComponent={<></>}
      />
    );
  }

  // State 2: User not authenticated or missing sharerId
  if (!currentUser || !sharerId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Please sign in to view your listings</h2>
        <p>You need to be authenticated to access this page.</p>
      </div>
    );
  }

  // State 3: Valid authenticated user with sharerId
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
