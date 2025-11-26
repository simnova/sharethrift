import { Form, Button, Typography, Checkbox } from 'antd';
import type { FC } from 'react';

const { Title, Text } = Typography;

interface TermsProps {
	loading: boolean;
	onSaveAndContinue: () => void;
}

export const Terms: FC<TermsProps> = (props) => {
	const [form] = Form.useForm();

	const handleSaveAndContinue = () => {
		props.onSaveAndContinue();
	};

	return (
		<div style={{ maxWidth: 600, margin: '0 auto' }}>
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
					Accept Terms
				</Title>
			</div>

			<div style={{ marginBottom: '2rem' }}>
				<Title level={3} style={{ color: 'var(--color-message-text)' }}>
					Terms & Conditions
				</Title>
			</div>
			<Text style={{ color: 'var(--color-message-text)' }}>
				By using this platform, you agree to the following terms and conditions
				regarding all item lending and borrowing activities:
			</Text>

			<div style={{ margin: '20px 0', color: 'var(--color-message-text)' }}>
				<ol style={{ margin: 0, paddingLeft: '20px' }}>
					<li style={{ marginBottom: '12px' }}>
						<strong>Third-Party Agreements</strong>
						<br />
						<Text style={{ color: 'var(--color-message-text)' }}>
							Our platform facilitates connections between users but does not
							participate in, review, or enforce any external agreements,
							contracts, or arrangements made between users, whether verbal or
							written.
						</Text>
					</li>
					<li style={{ marginBottom: '12px' }}>
						<strong>No Liability for Off-Platform Actions</strong>
						<br />
						<Text style={{ color: 'var(--color-message-text)' }}>
							Any legal agreements, safety provisions, item inspections,
							financial transactions, or dispute resolutions conducted outside
							of this platform are entirely the responsibility of the involved
							users. The platform is not liable for any loss, damage, injury,
							theft, or legal issue that arises from such off-platform
							interactions.
						</Text>
					</li>
					<li style={{ marginBottom: '12px' }}>
						<strong>User Responsibility</strong>
						<br />
						<Text style={{ color: 'var(--color-message-text)' }}>
							It is the sole responsibility of each user to ensure the safety,
							legality, and suitability of any items borrowed or lent. Users are
							also responsible for understanding and complying with local laws
							and regulations.
						</Text>
					</li>
				</ol>

				<div style={{ marginTop: '20px', color: 'var(--color-message-text)' }}>
					<strong>Additional Notes:</strong>
					<ul style={{ margin: '8px 0 0 20px' }}>
						<li>
							We encourage users to communicate clearly, inspect items
							carefully.
						</li>
						<li>
							By continuing to use this platform, you acknowledge that all item
							exchanges are done at your own risk.
						</li>
					</ul>
				</div>
			</div>

			<Form
				form={form}
				layout="vertical"
				onFinish={handleSaveAndContinue}
				autoComplete="off"
			>
				<Form.Item
					name="acceptTerms"
					valuePropName="checked"
					rules={[
						{
							required: true,
							message: 'You must accept the terms and conditions to continue',
							transform: (value) => value || undefined,
							type: 'boolean',
						},
					]}
					style={{ marginBottom: 16 }}
				>
					<Checkbox style={{ color: 'var(--color-message-text)' }}>
						I accept these Terms and Conditions
					</Checkbox>
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
							borderRadius: '20px',
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
