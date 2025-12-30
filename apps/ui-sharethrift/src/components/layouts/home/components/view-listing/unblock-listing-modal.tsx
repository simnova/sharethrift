import { Modal } from 'antd';

interface UnblockListingModalProps {
	visible: boolean;
	listingTitle: string;
	listingSharer: string;
	blockReason?: string;
	blockDescription?: string;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export const UnblockListingModal: React.FC<UnblockListingModalProps> = ({
	visible,
	listingTitle,
	listingSharer,
	onConfirm,
	onCancel,
	loading = false,
}) => {
	return (
		<Modal
			title="Unblock Listing"
			open={visible}
			onOk={onConfirm}
			onCancel={onCancel}
			okText="Unblock"
			cancelText="Cancel"
			confirmLoading={loading}
		>
			<div style={{ marginBottom: 16 }}>
				<p>
					Are you sure you want to unblock <strong>{listingTitle}</strong>{' '}
					posted by <strong>{listingSharer}</strong>?
				</p>
			</div>
		</Modal>
	);
};
