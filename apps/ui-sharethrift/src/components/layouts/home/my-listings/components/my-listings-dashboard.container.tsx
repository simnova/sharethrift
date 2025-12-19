import { useQuery } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import {
  HomeAllListingsTableContainerMyListingsAllDocument,
  HomeMyListingsDashboardContainerMyListingsRequestsCountDocument,
  ViewListingCurrentUserDocument,
  type ViewListingCurrentUserQuery,
} from "../../../../../generated.tsx";
import { MyListingsDashboard } from "./my-listings-dashboard.tsx";

import { useNavigate } from 'react-router-dom';

export const MyListingsDashboardContainer: React.FC = () => {
  const { data: userData, loading: userLoading } =
    useQuery<ViewListingCurrentUserQuery>(ViewListingCurrentUserDocument);

  const currentUser = userData?.currentUser;
  const sharerId = currentUser?.id ?? "";

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
        sharerId: sharerId,
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
      loading={userLoading || loading}
      error={error}
      hasData={data ?? null}
      hasDataComponent={
        <MyListingsDashboard
          onCreateListing={handleCreateListing}
          requestsCount={requestsCountData?.myListingsRequests?.length ?? 0}
          sharerId={sharerId}
        />
      }
    />
  );
};
