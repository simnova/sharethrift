import { Row, Col, Button, Modal, Form, Select, Input, Alert } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ListingImageGalleryContainer } from './listing-image-gallery/listing-image-gallery.container.tsx';
import { SharerInformationContainer } from './sharer-information/sharer-information.container.tsx';
import { ListingInformationContainer } from './listing-information/listing-information.container.tsx';
import type {
	ItemListing,
	ViewListingActiveReservationRequestForListingQuery,
} from '../../../../../generated.tsx';
import {
	BlockListingDocument,
	UnblockListingDocument,
} from '../../../../../generated.tsx';

const { TextArea } = Input;

const BLOCK_REASONS = [
	'Inappropriate Content',
	'Fraudulent Activity',
	'Terms Violation',
	'Safety Concerns',
	'Other',
];

export interface ViewListingProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	currentUserId?: string | null;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	sharedTimeAgo?: string;
	userIsAdmin?: boolean;
}

export const ViewListing: React.FC<ViewListingProps> = ({
	listing,
	userIsSharer,
	isAuthenticated,
	currentUserId,
	userReservationRequest,
	sharedTimeAgo,
	userIsAdmin = false,
}) => {
	// Mock sharer info (since ItemListing.sharer is just an ID)
	const sharer = listing.sharer;
	const isBlocked = listing.state === 'Blocked';

	// Block/Unblock modal state
	const [blockModalVisible, setBlockModalVisible] = useState(false);
	const [unblockModalVisible, setUnblockModalVisible] = useState(false);
	const [blockForm] = Form.useForm();

	const [blockListing, { loading: blockLoading }] = useMutation(BlockListingDocument, {
		refetchQueries: ['ViewListing'],
		onCompleted: () => {
			setBlockModalVisible(false);
			blockForm.resetFields();
		},
	});

	const [unblockListing, { loading: unblockLoading }] = useMutation(UnblockListingDocument, {
		refetchQueries: ['ViewListing'],
		onCompleted: () => {
			setUnblockModalVisible(false);
		},
	});

	const handleBlockConfirm = async () => {
		try {
			await blockForm.validateFields();
			// Note: Block reason and description are validated but not currently persisted.
			// This ensures admins document their reasoning, and fields are ready for future
			// backend enhancement to store audit trail information.
			await blockListing({
				variables: { id: listing.id },
			});
		} catch (error) {
			console.error('Block validation failed:', error);
		}
	};

	const handleUnblockConfirm = async () => {
		await unblockListing({
			variables: { id: listing.id },
		});
	};

	const handleBack = () => {
		window.location.href = '/';
	};

	// If listing is blocked and user is not admin, show access denied
	if (isBlocked && !userIsAdmin) {
		return (
			<Row
				style={{
					paddingLeft: 100,
					paddingRight: 100,
					paddingTop: 50,
					paddingBottom: 75,
					boxSizing: 'border-box',
					width: '100%',
				}}
			>
				<Col span={24}>
					<Alert
						message="Access Denied"
						description="This listing is currently blocked and cannot be viewed."
						type="error"
						showIcon
					/>
				</Col>
			</Row>
		);
	}

	return (
		<>
			<style>{`

		@media (max-width: 600px) {
		  .view-listing-responsive {
			padding-left: 16px !important;
			padding-right: 16px !important;
			padding-top: 24px !important;
			padding-bottom: 24px !important;
		  }
		  .listing-main-responsive {
			flex-direction: column !important;
			gap: 0 !important;
			align-items: center !important;
		  }
		  .sharer-info-responsive {
			align-items: center !important;
		  }
		  .listing-gallery-responsive,
		  .listing-info-responsive,
		  .sharer-info-responsive {
			width: 100% !important;
			max-width: 450px !important;
			margin-left: auto !important;
			margin-right: auto !important;
		  }
		  .listing-info-text-row,
		  .sharer-info-text-row {
			width: 100% !important;
			text-align: left !important;
		  }
		  .listing-gallery-responsive {
			height: auto !important;
			margin-bottom: 8px !important;
		  }
		  .listing-info-responsive {
			margin-bottom: 16px !important;
		  }
		  .sharer-info-responsive {
			margin-bottom: 16px !important;
		  }
		}
	  `}</style>
			<Row
				style={{
					paddingLeft: 100,
					paddingRight: 100,
					paddingTop: 50,
					paddingBottom: 75,
					boxSizing: 'border-box',
					width: '100%',
					...(isBlocked && { opacity: 0.6, pointerEvents: 'none' }),
				}}
				gutter={[0, 24]}
				className="view-listing-responsive"
			>
				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					<Button
						className="primaryButton"
						icon={<LeftOutlined />}
						onClick={handleBack}
						type="primary"
						aria-label="Back"
					>
						Back
					</Button>
				</Col>

				{/* Warning banner for blocked listings */}
				{isBlocked && userIsAdmin && (
					<Col span={24}>
						<Alert
							message="This listing is currently blocked"
							description="Only administrators can view blocked listings."
							type="warning"
							showIcon
							style={{ pointerEvents: 'auto' }}
						/>
					</Col>
				)}

				{/* Admin action buttons */}
				{userIsAdmin && (
					<Col span={24}>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', pointerEvents: 'auto' }}>
							{isBlocked ? (
								<Button
									type="primary"
									onClick={() => setUnblockModalVisible(true)}
									loading={unblockLoading}
								>
									Unblock Listing
								</Button>
							) : (
								<Button
									danger
									onClick={() => setBlockModalVisible(true)}
									loading={blockLoading}
								>
									Block Listing
								</Button>
							)}
						</div>
					</Col>
				)}

				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					{/* Sharer Info at top, clickable to profile */}
					<SharerInformationContainer
						sharerId={sharer?.id}
						listingId={listing.id}
						isOwner={sharer?.id === currentUserId}
						className="sharer-info-responsive"
						sharedTimeAgo={sharedTimeAgo}
						currentUserId={currentUserId}
					/>
				</Col>
				<Col span={24} style={{ marginTop: 0, paddingTop: 0 }}>
					{/* Main content: 2 columns on desktop, stacked on mobile */}
					<Row
						gutter={36}
						align="top"
						style={{ marginTop: 0, paddingTop: 0 }}
						className="listing-main-responsive"
					>
						{/* Left: Images */}
						<Col
							xs={24}
							md={12}
							style={{
								display: 'flex',
								alignItems: 'flex-start',
								justifyContent: 'center',
								marginTop: 0,
								paddingTop: 0,
							}}
						>
							<ListingImageGalleryContainer
								listingId={listing.id}
								className="listing-gallery-responsive"
							/>
						</Col>
					{/* Right: Info/Form */}
					<Col xs={24} md={12} style={{ marginTop: 0, paddingTop: 0 }}>
						<ListingInformationContainer
							listing={listing}
							userIsSharer={userIsSharer}
							isAuthenticated={isAuthenticated}
							userReservationRequest={userReservationRequest}
							className="listing-info-responsive"
						/>
					</Col>
					</Row>
				</Col>
			</Row>

			{/* Block Listing Modal */}
			<Modal
				title="Block Listing"
				open={blockModalVisible}
				onOk={handleBlockConfirm}
				onCancel={() => {
					setBlockModalVisible(false);
					blockForm.resetFields();
				}}
				okText="Block"
				okButtonProps={{ danger: true, loading: blockLoading }}
			>
				<p style={{ marginBottom: 16 }}>
					You are about to block <strong>{listing.title}</strong>. This will prevent users from viewing or reserving this listing.
				</p>
				<Form form={blockForm} layout="vertical">
					<Form.Item
						name="reason"
						label="Reason for Block"
						rules={[{ required: true, message: 'Please select a reason' }]}
					>
						<Select placeholder="Select a reason">
							{BLOCK_REASONS.map((reason) => (
								<Select.Option key={reason} value={reason}>
									{reason}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[
							{ required: true, message: 'Please provide a description' },
						]}
					>
						<TextArea
							rows={4}
							placeholder="Provide details about why this listing is being blocked"
							maxLength={1000}
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* Unblock Listing Modal */}
			<Modal
				title="Unblock Listing"
				open={unblockModalVisible}
				onOk={handleUnblockConfirm}
				onCancel={() => setUnblockModalVisible(false)}
				okText="Unblock"
				okButtonProps={{ loading: unblockLoading }}
			>
				<p>
					Are you sure you want to unblock <strong>{listing.title}</strong>?
				</p>
				<p style={{ color: '#666', fontSize: '14px' }}>
					This will restore the listing and allow users to view and reserve it again.
				</p>
			</Modal>
		</>
	);
};
