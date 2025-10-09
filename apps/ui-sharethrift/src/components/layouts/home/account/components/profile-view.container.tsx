import { useNavigate } from 'react-router-dom';
import { ProfileView } from '../pages/profile-view.tsx';
import { useQuery } from '@apollo/client';
import type {
	CurrentUserQueryData,
	UserListingsQueryData,
	UserListing,
} from './profile-view.types.ts';
import {
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
} from '../../../../../generated.tsx';

function ProfileViewLoader() {
	const navigate = useNavigate();

	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery<CurrentUserQueryData>(
		HomeAccountProfileViewContainerCurrentUserDocument,
	);

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

	if (userError || listingsError) {
		// When API is not available, show mock data for demonstration
		const mockUser = {
			id: 'mock-user-id',
			firstName: 'Patrick',
			lastName: 'Garcia',
			username: 'patrick_g',
			email: 'patrick.g@example.com',
			accountType: 'personal',
			location: {
				city: 'Philadelphia',
				state: 'PA',
			},
			createdAt: new Date('2024-08-01').toISOString(),
		};
		const mockListings = [
			{
				id: '64f7a9c2d1e5b97f3c9d0a41',
				title: 'City Bike',
				description:
					'Perfect city bike for commuting and leisure rides around the neighborhood.',
				category: 'Vehicles & Transportation',
				location: 'Philadelphia, PA',
				state: 'Published',
				images: ['/assets/item-images/bike.png'],
				createdAt: '2024-08-01T00:00:00.000Z',
				sharingPeriodStart: '2024-08-11T00:00:00.000Z',
				sharingPeriodEnd: '2024-12-23T00:00:00.000Z',
			},
			{
				id: '64f7a9c2d1e5b97f3c9d0a13',
				title: 'Projector',
				description: 'HD projector for movie nights and presentations.',
				category: 'Electronics',
				location: 'Philadelphia, PA',
				state: 'Published',
				images: ['/assets/item-images/projector.png'],
				createdAt: '2024-08-13T00:00:00.000Z',
				sharingPeriodStart: '2024-08-13T00:00:00.000Z',
				sharingPeriodEnd: '2024-12-23T00:00:00.000Z',
			},
		];
		return (
			<ProfileView
				user={mockUser}
				listings={mockListings}
				isOwnProfile={true}
				onEditSettings={handleEditSettings}
				onListingClick={handleListingClick}
			/>
		);
	}

	if (userLoading || listingsLoading) {
		return <div>Loading profile...</div>;
	}

	if (!userData?.currentPersonalUserAndCreateIfNotExists) {
		return <div>User not found</div>;
	}

	const user = userData.currentPersonalUserAndCreateIfNotExists;
	const userListings =
		listingsData?.itemListings?.filter(
			(listing: UserListing & { sharer: string; updatedAt: string }) => {
				if (user?.account?.profile) {
					const { firstName, lastName } = user.account.profile;
					const userDisplayName = `${firstName} ${lastName.charAt(0)}.`;
					return listing.sharer === userDisplayName;
				}
				return false;
			},
		) || [];

	return (
		<ProfileView
			user={{
				id: user.id,
				firstName: user.account.profile.firstName,
				lastName: user.account.profile.lastName,
				username: user.account.username,
				email: user.account.email,
				accountType: user.account.accountType,
				location: {
					city: user.account.profile.location.city,
					state: user.account.profile.location.state,
				},
				createdAt: user.createdAt,
			}}
			listings={userListings.map(
				(listing: UserListing & { sharer: string; updatedAt: string }) => ({
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

export function ProfileViewContainer() {
	return <ProfileViewLoader />;
}
