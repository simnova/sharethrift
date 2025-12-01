import { Button, Form, Input, Typography } from 'antd';
import type {
	PersonalUser,
	PersonalUserUpdateInput,
} from '../../../../generated.tsx';

const { Title } = Typography;

interface AccountSetupProps {
	currentPersonalUserData?: PersonalUser;
	onSaveAndContinue: (values: PersonalUserUpdateInput) => void;
	loading: boolean;
}

export const AccountSetup: React.FC<AccountSetupProps> = (props) => {
	const [form] = Form.useForm();

	const handleSaveAndContinue = (values: PersonalUserUpdateInput) => {
		console.log('Form values before submitting:', values);
		props.onSaveAndContinue(values);
	};

	return (
		<div style={{ maxWidth: 500, margin: '0 auto' }}>
			<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
				<Title
					level={1}
					className="title36"
					style={{
						textAlign: 'center',
						marginBottom: '32px',
						color: 'var(--color-message-text)',
					}}
				>
					Account Setup
				</Title>
			</div>

			<Form
				initialValues={props.currentPersonalUserData}
				form={form}
				layout="vertical"
				onFinish={handleSaveAndContinue}
				autoComplete="off"
			>
				{/* hidden field to store the user ID */}
				<Form.Item label="User ID" name={['id']} style={{ display: 'none' }}>
					<Input aria-label="User ID" autoComplete="off" />
				</Form.Item>

				<Form.Item label="Email" style={{ marginBottom: 12 }}>
					<Input
						autoFocus
						aria-label="Email"
						autoComplete="email"
						disabled
						value={props.currentPersonalUserData?.account?.email ?? ''}
					/>
				</Form.Item>

				<Form.Item
					label="Username"
					name={['account', 'username']}
					style={{ marginBottom: 12 }}
					rules={[
						{ required: true, message: 'Username is required' },
						{ min: 3, message: 'Username must be at least 3 characters' },
						{ max: 30, message: 'Username must be less than 30 characters' },
						{
							pattern: /^[a-zA-Z0-9_]+$/,
							message:
								'Username can only contain letters, numbers, and underscores',
						},
					]}
				>
					<Input
						placeholder="Your Username"
						aria-label="Username"
						autoComplete="username"
					/>
				</Form.Item>

				<Form.Item style={{ marginTop: '2rem', textAlign: 'right' }}>
					<Button
						type="primary"
						htmlType="submit"
						size="large"
						style={{
							width: '180px',
							height: '38px',
							fontSize: '16px',
							fontWeight: 600,
						}}
						loading={props.loading}
					>
						Save and Continue
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
