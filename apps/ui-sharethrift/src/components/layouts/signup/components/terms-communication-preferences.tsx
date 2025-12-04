import type { FC } from 'react';
import { Form, Radio, Space, Checkbox, Typography } from 'antd';

const { Title } = Typography;

// currently is not used because these features are not available yet
export const TermsCommunicationPreferences: FC = () => {
	return (
		<>
			<Title
				level={3}
				style={{ marginTop: '2rem', color: 'var(--color-message-text)' }}
			>
				Communication Preferences
			</Title>

			<Title
				level={4}
				style={{
					marginTop: '1.5rem',
					marginBottom: '1rem',
					color: 'var(--color-message-text)',
				}}
			>
				Listing Notifications
			</Title>
			<Form.Item
				name="listingNotifications"
				valuePropName="checked"
				initialValue={true}
				style={{ marginBottom: 12 }}
			>
				<Checkbox style={{ color: 'var(--color-message-text)' }}>
					List notifications when someone requests to borrow an item, reminders
					from ShareThrift about items you are lending out.
				</Checkbox>
			</Form.Item>

			<Title
				level={4}
				style={{
					marginTop: '1.5rem',
					marginBottom: '1rem',
					color: 'var(--color-message-text)',
				}}
			>
				Reservations
			</Title>
			<Form.Item
				name="reservationNotifications"
				valuePropName="checked"
				initialValue={true}
				style={{ marginBottom: 12 }}
			>
				<Checkbox style={{ color: 'var(--color-message-text)' }}>
					Reservation notifications on items you are requesting to borrow,
					reminders from ShareThrift about items you are borrowing.
				</Checkbox>
			</Form.Item>

			<Title
				level={4}
				style={{
					marginTop: '1.5rem',
					marginBottom: '1rem',
					color: 'var(--color-message-text)',
				}}
			>
				Recommendations
			</Title>
			<Form.Item
				name="recommendations"
				initialValue="yes"
				style={{ marginBottom: 24 }}
			>
				<Radio.Group>
					<Space direction="vertical">
						<Radio value="yes" style={{ color: 'var(--color-message-text)' }}>
							Get ShareThrift tips and recommendations.
						</Radio>
					</Space>
				</Radio.Group>
			</Form.Item>
		</>
	);
};
