import { useQuery } from '@apollo/client/react';
import { message } from 'antd';
import { SettingsView } from '../pages/settings-view.tsx';
import type {
	CurrentUserSettingsQueryData,
	SettingsUser,
} from './settings-view.types.ts';
import { HomeAccountSettingsViewContainerCurrentUserDocument } from '../../../../../../generated.tsx';

export const SettingsViewContainer: React.FC = () => {
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery<CurrentUserSettingsQueryData>(
		HomeAccountSettingsViewContainerCurrentUserDocument,
	);

	const handleEditSection = (section: string) => {
		// TODO: Implement edit functionality
		message.info(`Edit ${section} functionality will be implemented`);
	};

	const handleChangePassword = () => {
		// TODO: Implement password change logic
		message.info('Password change functionality will be implemented');
	};

	if (userError) {
		// When API is not available, show mock data for demonstration
		const mockUser: SettingsUser = {
			id: 'mock-user-id',
			firstName: 'Patrick',
			lastName: 'Garcia',
			username: 'patrick_g',
			email: 'patrick.g@example.com',
			accountType: 'personal',
			location: {
				address1: '123 Main Street',
				address2: 'Apt 4B',
				city: 'Philadelphia',
				state: 'PA',
				country: 'United States',
				zipCode: '19101',
			},
			billing: {
				subscriptionId: 'sub_123456789',
				cybersourceCustomerId: 'cust_abc123',
			},
			createdAt: new Date('2024-08-01').toISOString(),
		};

		return (
			<SettingsView
				user={mockUser}
				onEditSection={handleEditSection}
				onChangePassword={handleChangePassword}
			/>
		);
	}

	if (userLoading) {
		return <div>Loading account settings...</div>;
	}

	if (!userData?.currentPersonalUserAndCreateIfNotExists) {
		return <div>User not found</div>;
	}

	const user = userData.currentPersonalUserAndCreateIfNotExists;

	const mappedUser: SettingsUser = {
		id: user.id,
		firstName: user.account.profile.firstName,
		lastName: user.account.profile.lastName,
		username: user.account.username,
		email: user.account.email,
		accountType: user.account.accountType,
		location: {
			address1: user.account.profile.location.address1,
			address2: user.account.profile.location.address2,
			city: user.account.profile.location.city,
			state: user.account.profile.location.state,
			country: user.account.profile.location.country,
			zipCode: user.account.profile.location.zipCode,
		},
		billing: user.account.profile.billing,
		createdAt: user.createdAt,
	};

	return (
		<SettingsView
			user={mappedUser}
			onEditSection={handleEditSection}
			onChangePassword={handleChangePassword}
		/>
	);
};
