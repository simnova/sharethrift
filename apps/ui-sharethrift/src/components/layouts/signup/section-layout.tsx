import { Outlet, useNavigate } from 'react-router-dom';
import { Footer, Header } from '@sthrift/ui-components';
import { useAuth } from 'react-oidc-context';
import { HandleLogout, HandleLogoutMockForMockAuth } from '../../shared/handle-logout.ts';
import { useApolloClient } from '@apollo/client/react';
import { useCreateListingNavigation } from '../home/components/create-listing/hooks/use-create-listing-navigation.ts';

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface SectionLayoutProps {}

export const SectionLayout: React.FC<SectionLayoutProps> = (_props) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const apolloClient = useApolloClient();

	const handleOnLogin = () => {
		navigate('/auth-redirect');
	};

	const handleOnSignUp = () => {
		navigate('/auth-redirect');
	};

	const handleCreateListing = useCreateListingNavigation();

	const handleLogOut = () => {
		if (process.env['NODE_ENV'] === 'development') {
			HandleLogoutMockForMockAuth(auth);
			return;
		}
		HandleLogout(auth, apolloClient);
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
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
};
