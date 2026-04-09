import { Form, Input, Button, Card, Typography, Grid } from 'antd';
import { Footer } from '../../molecules/footer/index.tsx';
import heroImg from '../../assets/hero/hero-small.png';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface LoginFormData {
	username: string;
	password: string;
}

interface LoginFormProps {
	title: string;
	emailPlaceholder: string;
	onSubmit: (values: LoginFormData) => void;
	submitting: boolean;
	onBack: () => void;
	headerSlot: React.ReactNode;
	footerSlot?: React.ReactNode;
	showForgotPassword?: boolean;
	onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
	title,
	emailPlaceholder,
	onSubmit,
	submitting,
	onBack,
	headerSlot,
	footerSlot,
	showForgotPassword,
	onForgotPassword,
}) => {
	const [form] = Form.useForm();
	const screens = useBreakpoint();
	const isMobile = !screens.md;

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
			{headerSlot}
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
									{title}
								</Title>
							</div>

							<Form
								form={form}
								layout="vertical"
								onFinish={onSubmit}
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
										placeholder={emailPlaceholder}
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
									<Button
										type="primary"
										htmlType="submit"
										size={isMobile ? 'middle' : 'large'}
										style={{
											width: '100%',
											height: isMobile ? '36px' : '38px',
											fontSize: isMobile ? '14px' : '16px',
											fontWeight: 600,
										}}
										loading={submitting}
										disabled={submitting}
									>
										Log In
									</Button>
								</Form.Item>

								<div
									style={{
										display: 'flex',
										justifyContent: showForgotPassword ? 'space-between' : 'flex-start',
										marginTop: '1rem',
									}}
								>
									<Button
										type="link"
										onClick={onBack}
										style={{ padding: 0 }}
									>
										← Back to Home
									</Button>
									{showForgotPassword && onForgotPassword && (
										<Button
											type="link"
											onClick={onForgotPassword}
											style={{ padding: 0 }}
										>
											Forgot password?
										</Button>
									)}
								</div>
							</Form>

							{footerSlot}
						</Card>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
};
