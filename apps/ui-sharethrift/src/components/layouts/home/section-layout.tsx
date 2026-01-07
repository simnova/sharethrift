import { useEffect, useState, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
	HomeOutlined,
	ContainerOutlined,
	CalendarOutlined,
	MessageOutlined,
	UserOutlined,
	BarChartOutlined,
} from '@ant-design/icons';
import { HandleLogout } from '../../shared/handle-logout.ts';
import { Footer, Header, Navigation } from '@sthrift/ui-components';
import { useCreateListingNavigation } from './components/create-listing/hooks/use-create-listing-navigation.ts';
import { useApolloClient } from '@apollo/client/react';
import { useUserIsAdmin } from './account/hooks/useUserIsAdmin.ts';

export const SectionLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();
	const apolloClient = useApolloClient();
	const { isAdmin } = useUserIsAdmin();

	// Map nav keys to routes as defined in index.tsx
	const routeMap = {
		home: '',
		listings: 'my-listings',
		reservations: 'my-reservations',
		messages: 'messages',
		account: 'account',
		adminDashboard: 'admin-dashboard',
	} as const;

	// Determine selectedKey from current location
	const getSelectedKey = () => {
		const path = location.pathname.replace(/^\//, '');
		// Account subroutes
		if (path.startsWith('account/')) {
			const sub = path.slice('account/'.length);
			if (sub.startsWith('profile')) return 'profile';
			if (sub.startsWith('settings')) return 'settings';
			return undefined;
		}
		const found = (Object.entries(routeMap) as [string, string][]).find(
			([, r]) => path === r || path.startsWith(`${r}/`),
		);
		return found?.[0] ?? 'home';
	};

	const handleNavigate = (key: string) => {
		// Handle account subroutes
		const accountSubTabs = ['profile', 'bookmarks', 'settings'];
		if (accountSubTabs.includes(key)) {
			return navigate(`/account/${key}`);
		}
		// If key is already in the form 'account/profile', 'account/settings', etc.
		if (key.startsWith('account/')) {
			return navigate(`/${key}`);
		}
		const r = routeMap[key as keyof typeof routeMap];
		if (r === undefined) {
			// If key is unknown, default to home
			navigate('/');
		} else {
			navigate(`/${r}`);
		}
	};
	// Responsive margin for main content: no margin if sidebar is hidden (logged out), else responsive
	const [mainMargin, setMainMargin] = useState(auth.isAuthenticated ? 240 : 0);
	const contentWidth = mainMargin > 0 ? `calc(100% - ${mainMargin}px)` : '100%';
	useEffect(() => {
		const handleResize = () => {
			if (!auth.isAuthenticated) {
				setMainMargin(0);
			} else {
				setMainMargin(window.innerWidth <= 768 ? 0 : 240);
			}
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [auth.isAuthenticated]);

	const isProduction = import.meta.env.MODE === 'production';

	function redirectLogin(
		portal: 'UserPortal' | 'AdminPortal',
		href: '/auth-redirect-user' | '/auth-redirect-admin',
	) {
		if (isProduction) {
			globalThis.sessionStorage.setItem('loginPortalType', portal);
			globalThis.location.href = href;
		} else {
			navigate('/login');
		}
	}

	const handleOnLogin = () =>
		redirectLogin('UserPortal', '/auth-redirect-user');
	const handleOnAdminLogin = () =>
		redirectLogin('AdminPortal', '/auth-redirect-admin');

	const handleOnSignUp = () => {
		navigate('/auth-redirect-user');
	};
	const handleCreateListing = useCreateListingNavigation();

	const handleLogOut = () => {
		HandleLogout(auth, apolloClient, window.location.origin);
	};

	// Build navigation items dynamically based on user role
	const navItems: MenuProps['items'] = useMemo(() => {
		const accountChildren: MenuProps['items'] = [
			{ key: 'profile', label: 'Profile' },
			{ key: 'settings', label: 'Settings' },
		];

		const baseItems: MenuProps['items'] = [
			{ key: 'home', icon: <HomeOutlined />, label: 'Home' },
			{
				key: 'listings',
				icon: <ContainerOutlined />,
				label: 'My Listings',
			},
			{
				key: 'reservations',
				icon: <CalendarOutlined />,
				label: 'My Reservations',
			},
			{ key: 'messages', icon: <MessageOutlined />, label: 'Messages' },
		];

		baseItems.push({
			key: 'account',
			icon: <UserOutlined />,
			label: 'Account',
			children: accountChildren,
		});

		// Add admin dashboard as a top-level item for admin users conditionally
		if (isAdmin) {
			baseItems.push({
				key: 'adminDashboard',
				icon: <BarChartOutlined />,
				label: 'Admin Dashboard',
			});
		}

		return baseItems;
	}, [isAdmin]);

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
				onAdminLogin={handleOnAdminLogin}
				onLogout={handleLogOut}
				onSignUp={handleOnSignUp}
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
				<Navigation
					isAuthenticated={auth.isAuthenticated}
					onNavigate={handleNavigate}
					onLogout={handleLogOut}
					selectedKey={getSelectedKey()}
					customNavItems={navItems}
				/>
				<main
					style={{
						marginLeft: mainMargin,
						width: contentWidth,
						minWidth: 0,
						boxSizing: 'border-box',
					}}
				>
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
};
