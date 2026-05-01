import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader, UserIdProvider } from '@sthrift/ui-shared';
import type { FC } from 'react';
import { useAuth } from 'react-oidc-context';
import { App } from './app.tsx';
import { AppContainerCurrentAdminUserDocument } from './generated.tsx';

export const AppContainer: FC = () => {
	const auth = useAuth();
	const hasUsableToken = Boolean(
		auth.user?.access_token ?? auth.user?.id_token,
	);
	const shouldBootstrapCurrentAdminUser =
		auth.isAuthenticated && hasUsableToken;

	const { data, loading, error } = useQuery(
		AppContainerCurrentAdminUserDocument,
		{
			skip: !shouldBootstrapCurrentAdminUser,
		},
	);

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
