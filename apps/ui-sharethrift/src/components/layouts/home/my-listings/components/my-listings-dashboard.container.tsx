import { MyListingsDashboard } from './my-listings-dashboard.tsx';
import { useQuery } from "@apollo/client/react";
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { HomeAllListingsTableContainerMyListingsAllDocument } from '../../../../../generated.tsx';

export const MyListingsDashboardContainer: React.FC = () => {
	const { data, loading, error } = useQuery(
		HomeAllListingsTableContainerMyListingsAllDocument, {
            variables: { page: 1, pageSize: 6 },
            fetchPolicy: 'network-only',
        }
	);

	const handleCreateListing = () => {
		// TODO: Navigate to listing creation page
		console.log('Navigate to create listing');
	};

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data}
			hasDataComponent={
				<MyListingsDashboard
					onCreateListing={handleCreateListing}
					requestsCount={data?.myListingsAll.total ?? 0}
				/>
			}
		/>
	);
}
