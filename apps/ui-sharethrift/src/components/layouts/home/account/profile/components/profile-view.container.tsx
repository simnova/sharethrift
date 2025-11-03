import { useNavigate } from 'react-router-dom';
import { ProfileView } from '../pages/profile-view.tsx';
import { useQuery } from "@apollo/client/react";
import type {
	UserListingsQueryData,
	UserListing,
} from './profile-view.types.ts';
import {
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
} from '../../../../../../generated.tsx';

function ProfileViewLoader() {
	const navigate = useNavigate();

	// Single query using union type
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery(HomeAccountProfileViewContainerCurrentUserDocument);

	const {
		data: listingsData,
		loading: listingsLoading,
		error: listingsError,
	} = useQuery<UserListingsQueryData>(
		HomeAccountProfileViewContainerUserListingsDocument,
	);

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

	const currentUser = userData?.currentUser;
	if (!currentUser) {
		return <div>User not found</div>;
	}

	// Get all listings
	const allListings = listingsData?.itemListings || [];

	// Handle AdminUser 
	if (currentUser.__typename === 'AdminUser') {
		return (
			<ProfileView
				user={{
					id: currentUser.id,
					firstName: currentUser.account?.firstName || 'Admin',
					lastName: currentUser.account?.lastName || 'User',
					username: currentUser.account?.username || '',
					email: currentUser.account?.email || '',
					accountType: currentUser.account?.accountType || 'admin',
					location: { city: 'N/A', state: 'N/A' },
					createdAt: currentUser.createdAt,
				}}
				listings={[]}
				isOwnProfile={true}
				onEditSettings={handleEditSettings}
				onListingClick={handleListingClick}
			/>
		);
	}

	// Handle PersonalUser
	if (currentUser.__typename === 'PersonalUser') {
		// Filter listings by current user
		const userListings = allListings.filter(
			(listing: UserListing & { sharer?: string; updatedAt: string }) => {
				const profile = currentUser?.account?.profile;
				if (profile?.firstName && profile?.lastName && listing.sharer) {
					const userDisplayName = `${profile.firstName} ${profile.lastName.charAt(0)}.`;
					return listing.sharer === userDisplayName;
				}
				return false;
			},
		);

		return (
			<ProfileView
				user={{
					id: currentUser.id,
					firstName: currentUser.account?.profile?.firstName || '',
					lastName: currentUser.account?.profile?.lastName || '',
					username: currentUser.account?.username || '',
					email: currentUser.account?.email || '',
					accountType: currentUser.account?.accountType || 'personal',
					location: {
						city: currentUser.account?.profile?.location?.city || '',
						state: currentUser.account?.profile?.location?.state || '',
					},
					createdAt: currentUser.createdAt,
				}}
				listings={userListings.map(
					(listing: UserListing & { sharer?: string; updatedAt: string }) => ({
						id: listing.id,
						title: listing.title,
						description: listing.description,
						category: listing.category,
						location: listing.location,
						state: listing.state,
						images: listing.images,
						createdAt: listing.createdAt,
						sharingPeriodStart: listing.sharingPeriodStart,
						sharingPeriodEnd: listing.sharingPeriodEnd,
					}),
				)}
				isOwnProfile={true}
				onEditSettings={handleEditSettings}
				onListingClick={handleListingClick}
			/>
		);
	}

	return <div>Unknown user type</div>;
}

export const ProfileViewContainer: React.FC = () => {
	return <ProfileViewLoader />;
};
