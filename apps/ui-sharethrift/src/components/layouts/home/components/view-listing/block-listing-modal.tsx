import { Button, Modal } from 'antd';

export interface BlockListingModalProps {
	visible: boolean;
	listingTitle: string;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export const BlockListingModal: React.FC<BlockListingModalProps> = ({
	visible,
	listingTitle,
	onConfirm,
	onCancel,
	loading = false,
}) => {
	const handleOk = () => {
		onConfirm();
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<Modal
			title="Block Listing"
			open={visible}
			onCancel={handleCancel}
			footer={[
				<Button key="cancel" onClick={handleCancel}>
					Cancel
				</Button>,
				<Button
					key="block"
					type="primary"
					danger
					onClick={handleOk}
					loading={loading}
				>
					Block
				</Button>,
			]}
		>
			<p style={{ marginBottom: 16 }}>
				You are about to block the listing: <strong>{listingTitle}</strong>
			</p>
			<p>
				Are you sure you want to block this listing? This will make it
				unavailable to all users except administrators.
			</p>
		</Modal>
	);
};
