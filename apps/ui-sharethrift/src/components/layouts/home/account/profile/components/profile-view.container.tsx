import { useNavigate } from 'react-router-dom';
import { ProfileView } from '../pages/profile-view.tsx';
import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';

import {
	type ItemListing,
	type PersonalUser,
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
} from '../../../../../../generated.tsx';

function ProfileViewLoader() {
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

	// const user = userData.currentPersonalUserAndCreateIfNotExists;
	// const userListings =
	// 	listingsData?.itemListings?.filter(
	// 		(listing: UserListing & { sharer: string; updatedAt: string }) => {
	// 			if (user?.account?.profile) {
	// 				const { firstName, lastName } = user.account.profile;
	// 				const userDisplayName = `${firstName} ${lastName.charAt(0)}.`;
	// 				return listing.sharer === userDisplayName;
	// 			}
	// 			return false;
	// 		},
	// 	) || [];

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
}

export const ProfileViewContainer: React.FC = () => {
	return <ProfileViewLoader />;
};
