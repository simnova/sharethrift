import { Card, Alert, Form, Input, Button, Tag, Space, Typography } from 'antd';
import {
	ExclamationCircleOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface UserAppealProps {
	isBlocked: boolean;
	existingAppeal?: {
		id: string;
		reason: string;
		state: 'requested' | 'accepted' | 'denied';
		createdAt: string;
	} | null;
	onSubmitAppeal: (reason: string) => void;
	loading?: boolean;
}

export const UserAppeal: React.FC<Readonly<UserAppealProps>> = ({
	isBlocked,
	existingAppeal,
	onSubmitAppeal,
	loading = false,
}) => {
	const [form] = Form.useForm();

	if (!isBlocked) {
		return null;
	}

	const getStateTag = (state: string) => {
		switch (state) {
			case 'requested':
				return (
					<Tag icon={<ExclamationCircleOutlined />} color="warning">
						Pending Review
					</Tag>
				);
			case 'accepted':
				return (
					<Tag icon={<CheckCircleOutlined />} color="success">
						Accepted
					</Tag>
				);
			case 'denied':
				return (
					<Tag icon={<CloseCircleOutlined />} color="error">
						Denied
					</Tag>
				);
			default:
				return null;
		}
	};

	const handleSubmit = async (values: { reason: string }) => {
		onSubmitAppeal(values.reason);
		form.resetFields();
	};

	return (
		<Card className="mb-6">
			<Alert
				message="Account Blocked"
				description="Your account has been blocked by an administrator. You can submit an appeal to request a review."
				type="error"
				showIcon
				className="mb-4"
			/>

			{existingAppeal ? (
				<div>
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						<div>
							<Text strong>Appeal Status: </Text>
							{getStateTag(existingAppeal.state)}
						</div>
						<div>
							<Text strong>Submitted:</Text>{' '}
							<Text>
								{new Date(existingAppeal.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</Text>
						</div>
						<div>
							<Text strong>Your Appeal:</Text>
							<Paragraph className="mt-2">{existingAppeal.reason}</Paragraph>
						</div>
						{existingAppeal.state === 'requested' && (
							<Alert
								message="Your appeal is under review"
								description="An administrator will review your appeal within 3-5 business days. You will be notified of the decision."
								type="info"
								showIcon
							/>
						)}
						{existingAppeal.state === 'denied' && (
							<Alert
								message="Appeal Denied"
								description="Your appeal has been reviewed and denied. If you believe this is an error, please contact support."
								type="error"
								showIcon
							/>
						)}
						{existingAppeal.state === 'accepted' && (
							<Alert
								message="Appeal Accepted"
								description="Your appeal has been accepted and your account will be unblocked shortly."
								type="success"
								showIcon
							/>
						)}
					</Space>
				</div>
			) : (
				<div>
					<Text strong className="block mb-3">
						Submit an Appeal
					</Text>
					<Form form={form} onFinish={handleSubmit} layout="vertical">
						<Form.Item
							name="reason"
							label="Reason for Appeal"
							rules={[
								{
									required: true,
									message: 'Please provide a reason for your appeal',
								},
								{
									min: 10,
									message: 'Appeal reason must be at least 10 characters',
								},
								{
									max: 1000,
									message: 'Appeal reason must be less than 1000 characters',
								},
							]}
						>
							<TextArea
								rows={6}
								placeholder="Please explain why you believe your account should be unblocked. Include any relevant details that may help in reviewing your appeal."
								maxLength={1000}
								showCount
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" loading={loading}>
								Submit Appeal
							</Button>
						</Form.Item>
					</Form>
				</div>
			)}
		</Card>
	);
};
