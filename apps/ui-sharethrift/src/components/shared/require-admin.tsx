import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserIsAdmin } from '../layouts/home/account/hooks/useUserIsAdmin.ts';

export interface RequireAdminProps {
	children: JSX.Element;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
	const { isAdmin, loading } = useUserIsAdmin();

	if (loading) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div>Checking permissions...</div>
			</div>
		);
	}

	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}

	return children;
};
