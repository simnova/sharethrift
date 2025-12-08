import { Modal } from 'antd';

export interface UnblockListingModalProps {
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
	blockReason,
	blockDescription,
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
			{blockReason && (
				<div style={{ marginBottom: 8 }}>
					<strong>Block Information</strong>
					<div style={{ marginTop: 8 }}>
						<div>
							<strong>Reason:</strong>
						</div>
						<div style={{ marginLeft: 8 }}>{blockReason}</div>
					</div>
					{blockDescription && (
						<div style={{ marginTop: 8 }}>
							<div>
								<strong>Description:</strong>
							</div>
							<div style={{ marginLeft: 8 }}>{blockDescription}</div>
						</div>
					)}
				</div>
			)}
			<p style={{ marginTop: 16 }}>
				Your listing has been blocked due to profanity in the description. In
				order to have your listing unblocked, please update your listing to
				comply with our guidelines and submit an appeal.
			</p>
		</Modal>
	);
};
