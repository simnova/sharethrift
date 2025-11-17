import { useMutation, useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { message } from 'antd';
import type React from 'react';
import { useState } from 'react';
import {
	HomeAccountSettingsViewContainerCurrentUserDocument,
	HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
	HomeAccountSettingsViewContainerUpdateAdminUserDocument,
} from '../../../../../../generated.tsx';
import { SettingsView } from '../pages/settings-view.tsx';
import type {
	CurrentUserSettingsQueryData,
	SettingsUser,
} from './settings-view.types.ts';

function SettingsViewLoader() {
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery<CurrentUserSettingsQueryData>(
		HomeAccountSettingsViewContainerCurrentUserDocument,
	);

	const [updateUserMutation, { loading: updateLoading, error: updateError }] =
		useMutation(HomeAccountSettingsViewContainerUpdatePersonalUserDocument, {
			onError: (err) => {
				// eslint-disable-next-line no-console
				console.error('[SettingsView] update mutation error', err);
				const msg = err?.message || 'Update failed';
				message.error(msg);
			},
		});

	const [
		updateAdminUserMutation,
		{ loading: updateAdminLoading, error: updateAdminError },
	] = useMutation(HomeAccountSettingsViewContainerUpdateAdminUserDocument, {
		onError: (err) => {
			// eslint-disable-next-line no-console
			console.error('[SettingsView] admin update mutation error', err);
			const msg = err?.message || 'Update failed';
			message.error(msg);
		},
	});

	const [isSavingSection, setIsSavingSection] = useState(false);

	const handleEditSection = () => {
		const currentPath = location.pathname;
		console.log('Current path:', currentPath);
		const newPath = currentPath.replace(/\/[^/]+$/, '/settings/edit');
		console.log('Navigating to:', newPath);
		// Navigate to edit page
		//navigate(newPath);
	};

	type EditableSection =
		| 'profile'
		| 'location'
		| 'plan'
		| 'billing'
		| 'password';
	// Profile type alias for clarity (only PersonalUser has nested profile)
	type UserProfile = {
		firstName: string;
		lastName: string;
		location: {
			address1?: string;
			address2?: string;
			city?: string;
			state?: string;
			country?: string;
			zipCode?: string;
		};
		billing?: {
			subscriptionId?: string;
			cybersourceCustomerId?: string;
		};
		aboutMe?: string;
	};

	// Helper to construct the next profile given the section being edited
	const buildNextProfile = (
		section: EditableSection,
		values: Record<string, any>,
		base: UserProfile,
	): UserProfile => {
		const isProfile = section === 'profile';
		const isLocation = section === 'location';
		const isBilling = section === 'billing';
		return {
			firstName: isProfile
				? (values['firstName'] ?? base.firstName)
				: base.firstName,
			lastName: isProfile
				? (values['lastName'] ?? base.lastName)
				: base.lastName,
			location: {
				address1: isLocation
					? (values['address1'] ?? base.location.address1 ?? '')
					: base.location.address1,
				address2: isLocation
					? (values['address2'] ?? base.location.address2 ?? '')
					: base.location.address2,
				city: isLocation
					? (values['city'] ?? base.location.city ?? '')
					: base.location.city,
				state: isLocation
					? (values['state'] ?? base.location.state ?? '')
					: base.location.state,
				country: isLocation
					? (values['country'] ?? base.location.country ?? '')
					: base.location.country,
				zipCode: isLocation
					? (values['zipCode'] ?? base.location.zipCode ?? '')
					: base.location.zipCode,
			},
			billing: {
				subscriptionId: isBilling
					? (values['subscriptionId'] ?? base.billing?.subscriptionId ?? '')
					: base.billing?.subscriptionId,
				cybersourceCustomerId: isBilling
					? (values['cybersourceCustomerId'] ??
						base.billing?.cybersourceCustomerId ??
						'')
					: base.billing?.cybersourceCustomerId,
			},
			...(isProfile && { aboutMe: values['aboutMe'] ?? base.aboutMe }),
		};
	};
	const handlePasswordChange = (section: EditableSection) => {
		if (section === 'password') {
			globalThis.alert?.('Password change is not implemented yet.');
			setIsSavingSection(false);
			return true;
		}
		return false;
	};

	const handleAdminUserSave = async (
		section: EditableSection,
		values: Record<string, any>,
		user: CurrentUserSettingsQueryData['currentUser'],
	) => {
		if (updateAdminLoading) {
			setIsSavingSection(false);
			return;
		}

		if (section === 'plan' || section === 'billing') {
			message.info('Admin users cannot edit plan or billing information');
			setIsSavingSection(false);
			return;
		}

		try {
			const base = user.account.profile;
			const nextProfile = buildNextProfile(section, values, base);
			const username =
				section === 'profile'
					? (values['username'] ?? user.account.username)
					: user.account.username;

			const { billing: _billing, ...adminProfile } = nextProfile;

			const result = await updateAdminUserMutation({
				variables: {
					input: {
						id: user.id,
						account: {
							username,
							profile: adminProfile,
						},
					},
				},
				refetchQueries: [
					{ query: HomeAccountSettingsViewContainerCurrentUserDocument },
				],
			});

			if (!result.data?.adminUserUpdate) {
				throw new Error('Admin user update failed');
			}

			message.success('Updated successfully');
		} catch (err: unknown) {
			console.error('[SettingsView] admin update mutation error', err);
			const msg =
				err instanceof Error ? err.message : 'Admin user update failed';
			message.error(msg);
			throw err;
		} finally {
			setIsSavingSection(false);
		}
	};

	const handlePersonalUserSave = async (
		section: EditableSection,
		values: Record<string, any>,
		user: CurrentUserSettingsQueryData['currentUser'],
	) => {
		if (updateLoading) {
			setIsSavingSection(false);
			return;
		}

		try {
			const base = user.account.profile;
			const nextProfile = buildNextProfile(section, values, base);
			const username =
				section === 'profile'
					? (values['username'] ?? user.account.username)
					: user.account.username;
			const accountType =
				section === 'plan'
					? (values['accountType'] ?? user.account.accountType)
					: user.account.accountType;

			const result = await updateUserMutation({
				variables: {
					input: {
						id: user.id,
						account: {
							username,
							accountType,
							profile: nextProfile,
						},
					},
				},
				refetchQueries: [
					{ query: HomeAccountSettingsViewContainerCurrentUserDocument },
				],
			});

			if (!result.data?.personalUserUpdate) {
				throw new Error('Update failed');
			}
		} catch (err: unknown) {
			console.error('[SettingsView] update mutation error', err);
			const msg = err instanceof Error ? err.message : 'Update failed';
			message.error(msg);
			throw err;
		} finally {
			setIsSavingSection(false);
		}
	};

	const handleSaveSection = async (
		section: EditableSection,
		values: Record<string, any>,
	) => {
		if (!userData?.currentUser) return;
		const user = userData.currentUser;

		setIsSavingSection(true);

		if (handlePasswordChange(section)) return;

		if (user.userType === 'admin-user') {
			await handleAdminUserSave(section, values, user);
		} else {
			await handlePersonalUserSave(section, values, user);
		}
	};

	const handleChangePassword = () => {
		globalThis.alert?.('Password change functionality will be implemented');
	};

	if (userLoading) {
		return <div>Loading account settings...</div>;
	}

	if (!userData?.currentUser) {
		return <div>User not found</div>;
	}

	const user = userData.currentUser;

	const mappedUser: SettingsUser = {
		id: user.id,
		firstName: user.account.profile.firstName,
		lastName: user.account.profile.lastName,
		aboutMe: user.account.profile.aboutMe,
		username: user.account.username,
		email: user.account.email,
		accountType: user.account.accountType,
		location: {
			address1: user.account.profile.location.address1 ?? '',
			address2: user.account.profile.location.address2 ?? '',
			city: user.account.profile.location.city ?? '',
			state: user.account.profile.location.state ?? '',
			country: user.account.profile.location.country ?? '',
			zipCode: user.account.profile.location.zipCode ?? '',
		},
		billing: user.userType === 'personal-users' && 'billing' in user.account.profile
			? user.account.profile.billing
			: undefined,
		createdAt: user.createdAt,
	};

	const errorMessage = userError ?? updateError ?? updateAdminError;

	return (
		<ComponentQueryLoader
			loading={userLoading || updateLoading || updateAdminLoading}
			error={errorMessage}
			hasData={userData}
			hasDataComponent={
				<SettingsView
					user={mappedUser}
					onEditSection={handleEditSection}
					onChangePassword={handleChangePassword}
					onSaveSection={handleSaveSection}
					isSavingSection={isSavingSection}
				/>
			}
		/>
	);
}

export const SettingsViewContainer: React.FC = () => <SettingsViewLoader />;
