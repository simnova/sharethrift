import { useNavigate } from 'react-router-dom';
import { ProfileView } from './profile-view.tsx';
import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import {
	type ItemListing,
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
} from '../../../../../../generated.tsx';

export const ProfileViewContainer: React.FC = () => {
	const navigate = useNavigate();

	const {
		data: userQueryData,
		loading: userLoading,
		error: userError,
	} = useQuery(HomeAccountProfileViewContainerCurrentUserDocument);

	const {
		data: listingsData,
		loading: listingsLoading,
		error: listingsError,
	} = useQuery(HomeAccountProfileViewContainerUserListingsDocument, {
		variables: { page: 1, pageSize: 100 },
	});

	const handleEditSettings = () => {
		navigate('/account/settings');
	};
	const handleListingClick = (listingId: string) => {
		navigate(`/listing/${listingId}`);
	};

	const currentUser = userQueryData?.currentUser;
	const account = currentUser?.account;
	const createdAt = currentUser?.createdAt;
	const isBlocked =
		currentUser?.__typename === 'PersonalUser'
			? currentUser.isBlocked
			: false;

	if (!currentUser) {
		return null;
	}

	const profileUser = {
		id: currentUser.id,
		firstName: account?.profile?.firstName || '',
		lastName: account?.profile?.lastName || '',
		username: account?.username || '',
		email: account?.email || '',
		accountType: account?.accountType || '',
		location: {
			city: account?.profile?.location?.city || '',
			state: account?.profile?.location?.state || '',
		},
		createdAt: createdAt || '',
		isBlocked: isBlocked || false,
	};

	const listings = (listingsData?.myListingsAll?.items || []).map((listing) => ({
		...listing,
		description: '',
		category: '',
		location: '',
		updatedAt: listing.createdAt,
		listingType: 'item',
	})) as ItemListing[];

	return (
		<ComponentQueryLoader
			loading={userLoading || listingsLoading}
			error={userError ?? listingsError}
			hasData={currentUser && listingsData?.myListingsAll}
			hasDataComponent={
				<ProfileView
					user={profileUser}
					listings={listings}
					isOwnProfile={true}
					isBlocked={false}
					isAdminViewer={false}
					canBlockUser={false}
					onEditSettings={handleEditSettings}
					onListingClick={handleListingClick}
				/>
			}
		/>
	);
};
