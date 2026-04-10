import { Button, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { LoginForm } from '@sthrift/ui-shared';
import { Header } from '../ui/molecules/header/index.tsx';

interface LoginFormData {
	username: string;
	password: string;
}

export const PersonalLogin: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();
	const auth = useAuth();

	const handleLogin = (_values: LoginFormData) => {
		setSubmitting(true);
		try {
			globalThis.location.href = '/auth-redirect-user';
		} finally {
			setSubmitting(false);
		}
	};

	const handleBack = () => {
		navigate('/');
	};

	const handleOnSignUp = () => {
		navigate('/auth-redirect-user');
	};

	const handleOnLogin = () => {
		globalThis.location.href = '/auth-redirect-user';
	};

	return (
		<LoginForm
			title="Log in or Sign up"
			emailPlaceholder="johndoe@email.com"
			onSubmit={handleLogin}
			submitting={submitting}
			onBack={handleBack}
			showForgotPassword
			onForgotPassword={() => navigate('/forgot-password')}
			headerSlot={
				<Header
					isAuthenticated={auth.isAuthenticated}
					onLogin={handleOnLogin}
					onLogout={() => navigate('/')}
					onSignUp={handleOnSignUp}
					onCreateListing={() => navigate('/login')}
				/>
			}
			footerSlot={
				<>
					<Divider style={{ margin: '24px 0' }}>or</Divider>
					<br />
					<Button
						size="large"
						onClick={handleOnSignUp}
						style={{
							width: '100%',
							height: '48px',
							fontSize: '16px',
							fontWeight: 600,
							backgroundColor: '#5c8a8a',
							borderColor: '#5c8a8a',
							color: '#fff',
						}}
					>
						Sign Up
					</Button>
				</>
			}
		/>
	);
};
