import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type React from 'react';

const { Paragraph } = Typography;

export interface AppealConfirmationModalProps {
	visible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export const AppealConfirmationModal: React.FC<
	AppealConfirmationModalProps
> = ({ visible, onConfirm, onCancel, loading }) => {
	return (
		<Modal
			title={
				<span>
					<ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
					Confirm Appeal
				</span>
			}
			open={visible}
			onOk={onConfirm}
			onCancel={onCancel}
			okText="Appeal"
			cancelText="Cancel"
			confirmLoading={loading}
			okButtonProps={{ danger: true }}
		>
			<Paragraph>
				Before you appeal, make sure you've reviewed and updated your listing to
				comply with our guidelines.
			</Paragraph>
			<Paragraph strong>
				Appeals without changes may be blocked. Are you sure you want to proceed?
			</Paragraph>
		</Modal>
	);
};
