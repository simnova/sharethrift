import { useNavigate } from 'react-router-dom';
import { ProfileView } from './profile-view.tsx';
import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';

import {
	type ItemListing,
	type PersonalUser,
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
} from '../../../../../../generated.tsx';

export const ProfileViewContainer: React.FC = () => {
	const navigate = useNavigate();

	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery(HomeAccountProfileViewContainerCurrentUserDocument);

	const {
		data: listingsData,
		loading: listingsLoading,
		error: listingsError,
	} = useQuery(HomeAccountProfileViewContainerUserListingsDocument);

	const handleEditSettings = () => {
		navigate('/account/settings');
	};
	const handleListingClick = (listingId: string) => {
		navigate(`/listing/${listingId}`);
	};

	console.log('userError:', userError);
	console.log('listingsError:', listingsError);

	return (
		<ComponentQueryLoader
			loading={userLoading || listingsLoading}
			error={userError || listingsError}
			hasData={
				userData?.currentPersonalUserAndCreateIfNotExists ||
				listingsData?.itemListings
			}
			hasDataComponent={
				<ProfileView
					user={
						userData?.currentPersonalUserAndCreateIfNotExists as PersonalUser
					}
					listings={listingsData?.itemListings as ItemListing[]}
					isOwnProfile={true}
					onEditSettings={handleEditSettings}
					onListingClick={handleListingClick}
				/>
			}
		/>
	);
};
