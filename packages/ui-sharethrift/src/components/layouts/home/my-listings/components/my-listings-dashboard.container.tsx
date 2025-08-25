import { MyListingsDashboard } from './my-listings-dashboard';

export function MyListingsDashboardContainer() {
  const handleCreateListing = () => {
    // TODO: Navigate to listing creation page
    console.log('Navigate to create listing');
  };

  return (
    <MyListingsDashboard onCreateListing={handleCreateListing} />
  );
}