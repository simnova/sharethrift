import type { FC } from 'react';
import { useQuery } from '@apollo/client/react';
import { AppContainerCurrentAdminUserDocument } from './generated.tsx';
import { App } from './app.tsx';
import { ComponentQueryLoader, UserIdProvider } from '@sthrift/ui-shared';
import { useAuth } from 'react-oidc-context';

export const AppContainer: FC = () => {
	const auth = useAuth();

	const { data, loading, error } = useQuery(AppContainerCurrentAdminUserDocument, {
		skip: !auth.isAuthenticated,
	});

	if (!auth.isAuthenticated) {
		return <App />;
	}

	const user = data?.currentAdminUser;
	const userId = user?.id;

	return (
		<ComponentQueryLoader
			loading={loading}
			hasData={user}
			error={error}
			hasDataComponent={
				<UserIdProvider userId={userId}>
					<App />
				</UserIdProvider>
			}
		/>
	);
};
