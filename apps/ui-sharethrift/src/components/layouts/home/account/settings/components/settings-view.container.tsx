import { useQuery } from '@apollo/client/react';
import { message } from 'antd';
import { SettingsView } from '../pages/settings-view.tsx';
import {
	HomeAccountSettingsViewContainerCurrentUserDocument,
	type PersonalUser,
} from '../../../../../../generated.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';

export const SettingsViewContainer: React.FC = () => {
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery(HomeAccountSettingsViewContainerCurrentUserDocument);

	const handleEditSection = (section: string) => {
		// TODO: Implement edit functionality
		message.info(`Edit ${section} functionality will be implemented`);
	};

	const handleChangePassword = () => {
		// TODO: Implement password change logic
		message.info('Password change functionality will be implemented');
	};

	return (
		<ComponentQueryLoader
			loading={userLoading}
			error={userError}
			hasData={userData?.currentPersonalUserAndCreateIfNotExists}
			hasDataComponent={
				<SettingsView
					user={
						userData?.currentPersonalUserAndCreateIfNotExists as PersonalUser
					}
					onEditSection={handleEditSection}
					onChangePassword={handleChangePassword}
				/>
			}
		/>
	);
};
