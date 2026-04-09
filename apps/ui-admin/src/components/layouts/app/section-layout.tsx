import { useEffect, useState, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
	HomeOutlined,
	MessageOutlined,
	BarChartOutlined,
} from '@ant-design/icons';
import { HandleLogout, Footer, Navigation } from '@sthrift/ui-shared';
import { useApolloClient } from '@apollo/client/react';
import { AdminHeader } from '../../shared/admin-header.tsx';

export const SectionLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();
	const apolloClient = useApolloClient();

	const routeMap = {
		home: '',
		messages: 'messages',
		adminDashboard: 'admin-dashboard',
	} as const;

	const getSelectedKey = () => {
		const path = location.pathname.replace(/^\//, '');
		const found = (Object.entries(routeMap) as [string, string][]).find(
			([, r]) => path === r || path.startsWith(`${r}/`)
		);
		return found?.[0] ?? 'home';
	};

	const handleNavigate = (key: string) => {
		const r = routeMap[key as keyof typeof routeMap];
		if (r === undefined) {
			navigate('/');
		} else {
			navigate(`/${r}`);
		}
	};

	const [mainMargin, setMainMargin] = useState(auth.isAuthenticated ? 240 : 0);
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

	const handleOnLogin = () => {
		navigate('/login');
	};

	const handleLogOut = () => {
		HandleLogout(auth, apolloClient, window.location.origin);
	};

	const navItems: MenuProps['items'] = useMemo(() => {
		return [
			{ key: 'home', icon: <HomeOutlined />, label: 'Home' },
			{ key: 'messages', icon: <MessageOutlined />, label: 'Messages' },
			{
				key: 'adminDashboard',
				icon: <BarChartOutlined />,
				label: 'Admin Dashboard',
			},
		];
	}, []);

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
			<AdminHeader
				isAuthenticated={auth.isAuthenticated}
				onLogin={handleOnLogin}
				onLogout={handleLogOut}
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
				<main style={{ marginLeft: mainMargin, width: '100%' }}>
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
};
