import { Form, Input, Button, Card, Typography, Space, Divider, Grid } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Footer, Header } from '@sthrift/ui-components';
import heroImg from '@sthrift/ui-components/src/assets/hero/hero-small.png';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface LoginFormData {
	username: string;
	password: string;
}

export const LoginSelection: React.FC = () => {
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();
	const auth = useAuth();
	const screens = useBreakpoint();
	const isMobile = !screens.md;

	const handleLogin = (_values: LoginFormData, isAdmin: boolean) => {
		setSubmitting(true);
		try {
			// Store the portal type for OAuth config selection
			globalThis.sessionStorage.setItem(
				'loginPortalType',
				isAdmin ? 'AdminPortal' : 'UserPortal'
			);
			// Force page reload to apply new OAuth config
			globalThis.location.href = isAdmin ? '/auth-redirect-admin' : '/auth-redirect-user';
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
				onLogin={() => navigate('/login')}
				onAdminLogin={() => navigate('/login')}
				onLogout={() => navigate('/')}
				onSignUp={handleOnSignUp}
				onCreateListing={() => navigate('/login')}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					flex: 1,
					height: '100vh',
					paddingTop: 64,
					backgroundImage: `url(${heroImg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
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
							maxWidth: 500,
							width: '100%',
							backgroundColor: 'rgba(232, 229, 220, 0.85)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(255, 255, 255, 0.3)',
								borderRadius: '12px',
								padding: '32px',
								boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
							}}
						>
							<div
								style={{
									textAlign: 'center',
									marginBottom: '2rem',
								}}
							>
								<Title
									level={1}
									className="title36"
									style={{
										textAlign: 'center',
										marginBottom: '32px',
										color: 'var(--color-message-text)',
									}}
								>
									Log in or Sign up
								</Title>
							</div>

							<Form
								form={form}
								layout="vertical"
								onFinish={(values) =>
									handleLogin(values, false)
								}
								autoComplete="off"
							>
								<Form.Item
									label="Email"
									name="email"
									style={{ marginBottom: 12 }}
									rules={[
										{
											required: true,
											message: 'Email is required',
										},
									]}
								>
									<Input
										placeholder="johndoe@email.com"
										autoFocus
										aria-label="Email"
										autoComplete="email"
									/>
								</Form.Item>

								<Form.Item
									label="Password"
									name="password"
									style={{ marginBottom: 12 }}
									rules={[
										{
											required: true,
											message: 'Password is required',
										},
									]}
								>
									<Input.Password
										placeholder="Your Password"
										aria-label="Password"
										autoComplete="current-password"
									/>
								</Form.Item>

								<Form.Item style={{ marginTop: '2rem' }}>
									<Space
										style={{
											width: '100%',
											justifyContent: 'center',
											gap: isMobile ? '8px' : '12px',
										}}
									>
										<Button
											type="default"
											size={isMobile ? 'middle' : 'large'}
											style={{
												width: isMobile ? '140px' : '180px',
												height: isMobile ? '36px' : '38px',
												fontSize: isMobile ? '14px' : '16px',
												fontWeight: 600,
											}}
											loading={submitting}
											disabled={submitting}
											onClick={() => {
												form.validateFields().then(
													(values) => {
														handleLogin(
															values,
															true
														);
													}
												);
											}}
										>
											Admin Login
										</Button>
										<Button
											type="primary"
											htmlType="submit"
											size={isMobile ? 'middle' : 'large'}
											style={{
												width: isMobile ? '140px' : '180px',
												height: isMobile ? '36px' : '38px',
												fontSize: isMobile ? '14px' : '16px',
												fontWeight: 600,
											}}
											loading={submitting}
											disabled={submitting}
										>
											Personal Login
										</Button>
									</Space>
								</Form.Item>

								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '1rem',
									}}
								>
									<Button type="link" onClick={handleBack} style={{ padding: 0 }}>
										← Back to Home
									</Button>
									<Button type="link" onClick={() => navigate('/forgot-password')} style={{ padding: 0 }}>
										Forgot password?
									</Button>
								</div>
							</Form>

							<Divider style={{ margin: '24px 0' }}>or</Divider>
                            <br />
							<Button
								block
								size="large"
								onClick={handleOnSignUp}
								style={{
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
						</Card>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
};
