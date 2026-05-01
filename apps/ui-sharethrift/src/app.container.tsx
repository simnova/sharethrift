import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader, UserIdProvider } from '@sthrift/ui-shared';
import type { FC } from 'react';
import { useAuth } from 'react-oidc-context';
import { App } from './app.tsx';
import { AppContainerCurrentUserDocument } from './generated.tsx';

export const AppContainer: FC = () => {
	const auth = useAuth();
	const hasUsableToken = Boolean(
		auth.user?.access_token ?? auth.user?.id_token,
	);
	const shouldBootstrapCurrentUser = auth.isAuthenticated && hasUsableToken;

	const { data, loading, error } = useQuery(AppContainerCurrentUserDocument, {
		skip: !shouldBootstrapCurrentUser,
	});

	if (!auth.isAuthenticated) {
		return <App hasCompletedOnboarding={false} isAuthenticated={false} />;
	}

	const user = data?.currentUserAndCreateIfNotExists;
	const userId = user?.__typename === 'PersonalUser' ? user.id : undefined;
	const hasCompletedOnboarding =
		(user?.__typename === 'PersonalUser' && user.hasCompletedOnboarding) ??
		false;

	return (
		<ComponentQueryLoader
			loading={loading}
			hasData={user}
			error={error}
			hasDataComponent={
				<UserIdProvider userId={userId}>
					<App
						hasCompletedOnboarding={hasCompletedOnboarding}
						isAuthenticated={shouldBootstrapCurrentUser}
					/>
				</UserIdProvider>
			}
		/>
	);
};
