import { Outlet, useNavigate } from 'react-router-dom';
import { Footer } from '@sthrift/ui-shared';
import { Header } from '../../ui/molecules/header/index.tsx';
import { useAuth } from 'react-oidc-context';
import { HandleLogout } from '@sthrift/ui-shared';
import { useApolloClient } from '@apollo/client/react';
import { useCreateListingNavigation } from '../../shared/hooks/use-create-listing-navigation.ts';
import { Card } from 'antd';

export const SectionLayout: React.FC = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const apolloClient = useApolloClient();

	const handleOnLogin = () => {
		navigate('/login');
	};

	const handleOnSignUp = () => {
		auth.signinRedirect({ extraQueryParams: { option: 'signup' } });
	};

	const handleCreateListing = useCreateListingNavigation();

	const handleLogOut = () => {
		HandleLogout(auth, apolloClient, globalThis.location.origin);
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				width: '100vw',
				overflowX: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Header
				isAuthenticated={auth.isAuthenticated}
				onLogin={handleOnLogin}
				onSignUp={handleOnSignUp}
				onLogout={handleLogOut}
				onCreateListing={handleCreateListing}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					flex: 1,
					height: '100vh',
					paddingTop: 64,
				}}
			>
				<main style={{ width: '100%' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: 'calc(100vh - 128px)',
							padding: '20px',
						}}
					>
						<Card
							style={{
								maxWidth: '100%',
								width: '100%',
								backgroundColor: 'transparent',
								border: 'none',
							}}
						>
							<Outlet />
						</Card>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
};
