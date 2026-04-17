import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { AdminHeader } from '@sthrift/ui-admin-route-shared';
import { LoginForm } from '@sthrift/ui-shared';

interface LoginFormData {
	username: string;
	password: string;
}

export const AdminLogin: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();
	const auth = useAuth();
	const handleBack = () => undefined;

	const handleLogin = (_values: LoginFormData) => {
		setSubmitting(true);
		try {
			globalThis.location.href = '/auth-redirect';
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<LoginForm
			title="Admin Log In"
			emailPlaceholder="admin@sharethrift.com"
			onSubmit={handleLogin}
			submitting={submitting}
			onBack={handleBack}
			showBack={false}
			headerSlot={
				<AdminHeader
					isAuthenticated={auth.isAuthenticated}
					onLogout={() => navigate('/')}
				/>
			}
		/>
	);
};
