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

	if (userError) {
		console.error('User query error:', userError);
		return <div>Error loading user: {userError.message}</div>;
	}

	if (listingsError) {
		console.error('Listings query error:', listingsError);
		// Continue rendering with empty listings instead of failing
	}

	if (userLoading || listingsLoading) {
		return <div>Loading profile...</div>;
	}

	const currentUser = userQueryData?.currentUser;
	if (!currentUser) {
		return <div>User not found</div>;
	}

	// Prepare user data based on user type
	const isAdmin = currentUser.userIsAdmin;
	const account = currentUser.account;
	let profileUser;
	if (account && isAdmin && account.__typename === 'AdminUserAccount') {
		profileUser = {
			id: currentUser.id,
			firstName: account.firstName || 'Admin',
			lastName: account.lastName || 'User',
			username: account.username || '',
			email: account.email || '',
			accountType: account.accountType || 'admin',
			location: { city: 'N/A', state: 'N/A' },
			createdAt: currentUser.createdAt || '',
		};
	} else if (account && !isAdmin && account.__typename === 'PersonalUserAccount') {
		profileUser = {
			id: currentUser.id,
			firstName: account.profile?.firstName || '',
			lastName: account.profile?.lastName || '',
			username: account.username || '',
			email: account.email || '',
			accountType: account.accountType || 'personal',
			location: {
				city: account.profile?.location?.city || '',
				state: account.profile?.location?.state || '',
			},
			createdAt: currentUser.createdAt || '',
		};
	} else {
		profileUser = {
			id: currentUser.id,
			firstName: '',
			lastName: '',
			username: '',
			email: '',
			accountType: '',
			location: { city: '', state: '' },
			createdAt: '',
		};
	}

	// Prepare listings with required fields from myListingsAll
	const listings = (listingsData?.myListingsAll?.items || []).map((listing) => ({
		...listing,
		description: '', // ListingAll doesn't have description
		category: '',
		location: '',
		updatedAt: listing.createdAt,
		listingType: 'item',
	})) as ItemListing[];

	return (
		<ComponentQueryLoader
			loading={userLoading || listingsLoading}
			error={userError ?? listingsError}
			hasData={userQueryData?.currentUser || listingsData?.myListingsAll}
			hasDataComponent={
				<ProfileView
					user={profileUser}
					listings={listings}
					isOwnProfile={true}
					onEditSettings={handleEditSettings}
					onListingClick={handleListingClick}
				/>
			}
		/>
	);
};
