import { MyListingsDashboard } from './my-listings-dashboard';
import { useQuery } from '@apollo/client';
import { HomeMyListingsDashboardContainerMyListingsRequestsCountDocument } from '../../../../../generated';

export function MyListingsDashboardContainer() {
  const { data } = useQuery(HomeMyListingsDashboardContainerMyListingsRequestsCountDocument);

  const handleCreateListing = () => {
    // TODO: Navigate to listing creation page
    console.log('Navigate to create listing');
  };

  return (
    <MyListingsDashboard 
      onCreateListing={handleCreateListing} 
      requestsCount={data?.myListingsRequests.total ?? 0}
    />
  );
}