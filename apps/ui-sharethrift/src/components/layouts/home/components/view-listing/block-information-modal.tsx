import { Alert, Button, Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type React from 'react';

const { Paragraph, Title } = Typography;

export interface BlockInformationModalProps {
	visible: boolean;
	onClose: () => void;
	onEditListing: () => void;
	onAppealBlock: () => void;
	blockReason?: string;
	blockDescription?: string;
	appealRequested?: boolean;
}

export const BlockInformationModal: React.FC<BlockInformationModalProps> = ({
	visible,
	onClose,
	onEditListing,
	onAppealBlock,
	blockReason,
	blockDescription,
	appealRequested,
}) => {
	return (
		<Modal
			title={
				<span>
					<ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
					Block Information
				</span>
			}
			open={visible}
			onCancel={onClose}
			footer={[
				<Button key="cancel" onClick={onClose}>
					Cancel
				</Button>,
				<Button key="edit" type="primary" onClick={onEditListing}>
					Edit Listing
				</Button>,
				<Button
					key="appeal"
					type="primary"
					danger
					onClick={onAppealBlock}
					disabled={appealRequested}
				>
					{appealRequested ? 'Appeal Submitted' : 'Appeal Block'}
				</Button>,
			]}
		>
			<div style={{ marginBottom: 16 }}>
				<Title level={5} style={{ marginBottom: 8 }}>
					Reason
				</Title>
				<Paragraph>{blockReason || 'No reason provided'}</Paragraph>
			</div>

			<div style={{ marginBottom: 16 }}>
				<Title level={5} style={{ marginBottom: 8 }}>
					Description
				</Title>
				<Paragraph>{blockDescription || 'No description provided'}</Paragraph>
			</div>

			{appealRequested && (
				<div style={{ marginTop: 16 }}>
					<Title level={5} style={{ marginBottom: 8 }}>
						Status
					</Title>
					<Paragraph>Appeal Requested</Paragraph>
				</div>
			)}

			{!appealRequested && (
				<Alert
					message="Before you appeal, make sure you've reviewed and updated your listing to address any issues. Appeals without changes may be blocked."
					type="info"
					showIcon
					icon={<ExclamationCircleOutlined />}
					style={{ marginTop: 16 }}
				/>
			)}
		</Modal>
	);
};
