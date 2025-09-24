import { MyListingsDashboard } from './my-listings-dashboard.tsx';
import { useQuery } from '@apollo/client';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { HomeMyListingsDashboardContainerMyListingsRequestsCountDocument } from '../../../../../generated.tsx';

export function MyListingsDashboardContainer() {
	const { data, loading, error } = useQuery(
		HomeMyListingsDashboardContainerMyListingsRequestsCountDocument,
	);

	const handleCreateListing = () => {
		// TODO: Navigate to listing creation page
		console.log('Navigate to create listing');
	};

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.myListingsRequests}
			hasDataComponent={
				<MyListingsDashboard
					onCreateListing={handleCreateListing}
					requestsCount={data?.myListingsRequests.total ?? 0}
				/>
			}
		/>
	);
}
