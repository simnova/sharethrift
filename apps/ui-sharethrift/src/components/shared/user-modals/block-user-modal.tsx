import { Modal, Typography, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface BlockUserModalProps {
	visible: boolean;
	userName: string;
	onConfirm: (reason: string) => void;
	onCancel: () => void;
	loading?: boolean;
}

export const BlockUserModal: React.FC<Readonly<BlockUserModalProps>> = ({
	visible,
	userName,
	onConfirm,
	onCancel,
	loading = false,
}) => {
	const [reason, setReason] = useState('');

	const handleOk = () => {
		onConfirm(reason);
		setReason(''); // Reset after confirm
	};

	const handleCancel = () => {
		setReason(''); // Reset on cancel
		onCancel();
	};

	return (
		<Modal
			title={
				<span>
					<ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
					Block User
				</span>
			}
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText="Block"
			okButtonProps={{ danger: true, loading }}
			cancelButtonProps={{ disabled: loading }}
			width={500}
			maskClosable={!loading}
			closable={!loading}
		>
			<div style={{ marginTop: 16 }}>
				<Paragraph>
					Are you sure you want to block <Text strong>{userName}</Text>?
				</Paragraph>
				<Paragraph type="secondary" style={{ fontSize: '14px' }}>
					Blocking this user will prevent them from accessing the platform and
					interacting with other users.
				</Paragraph>
				<div style={{ marginTop: 16 }}>
					<Text strong>Reason for blocking:</Text>
					<TextArea
						placeholder="Please provide a reason for blocking this user..."
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						rows={4}
						maxLength={500}
						showCount
						disabled={loading}
						style={{ marginTop: 8 }}
					/>
				</div>
			</div>
		</Modal>
	);
};
