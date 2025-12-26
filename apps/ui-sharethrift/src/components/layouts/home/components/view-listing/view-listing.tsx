import { Row, Col, Button, Alert } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { message } from 'antd';
import { ListingImageGalleryContainer } from './listing-image-gallery/listing-image-gallery.container.tsx';
import { SharerInformationContainer } from './sharer-information/sharer-information.container.tsx';
import { ListingInformationContainer } from './listing-information/listing-information.container.tsx';
import { BlockInformationModal } from './block-information-modal.tsx';
import { AppealConfirmationModal } from './appeal-confirmation-modal.tsx';
import type {
	ItemListing,
	ViewListingActiveReservationRequestForListingQuery,
	ViewListingAppealRequestByListingIdQuery,
} from '../../../../../generated.tsx';
import { HomeListingInformationCreateListingAppealRequestDocument } from '../../../../../generated.tsx';

interface ViewListingProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	currentUserId?: string | null;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	appealRequest:
		| ViewListingAppealRequestByListingIdQuery['getListingAppealRequestByListingId']
		| null
		| undefined;
	onAppealRequestSuccess?: () => void;
	sharedTimeAgo?: string;
}

export const ViewListing: React.FC<ViewListingProps> = ({
	listing,
	userIsSharer,
	isAuthenticated,
	currentUserId,
	userReservationRequest,
	appealRequest,
	onAppealRequestSuccess,
	sharedTimeAgo,
}) => {
	const navigate = useNavigate();
	const [blockInfoModalVisible, setBlockInfoModalVisible] = useState(false);
	const [appealConfirmModalVisible, setAppealConfirmModalVisible] =
		useState(false);
	const [appealSuccess, setAppealSuccess] = useState(false);

	const [createAppealRequest, { loading: appealLoading }] = useMutation(
		HomeListingInformationCreateListingAppealRequestDocument,
		{
			onCompleted: () => {
				setAppealSuccess(true);
				setAppealConfirmModalVisible(false);
				setBlockInfoModalVisible(false);
				message.success('Appeal requested successfully.');
				onAppealRequestSuccess?.();
			},
			onError: (error) => {
				message.error(`Failed to submit appeal: ${error.message}`);
			},
		},
	);

	// Mock sharer info (since ItemListing.sharer is just an ID)
	const sharer = listing.sharer;

	const handleBack = () => {
		window.location.href = '/';
	};

	const handleEditListing = () => {
		navigate(`/create-listing/${listing.id}`);
	};

	const handleAppealBlock = () => {
		setBlockInfoModalVisible(false);
		setAppealConfirmModalVisible(true);
	};

	const handleAppealConfirm = async () => {
		if (!currentUserId || !listing.id) {
			message.error('Unable to submit appeal. Please try again.');
			return;
		}

		// TODO: SECURITY - Get actual blocker ID from listing block metadata
		// For now, using a placeholder. The blocker should be tracked when blocking occurs.
		const blockerId = listing.sharer?.id || currentUserId;

		await createAppealRequest({
			variables: {
				input: {
					userId: currentUserId,
					listingId: listing.id,
					reason: 'User is appealing the block on this listing',
					blockerId,
				},
			},
		});
	};

	const isBlocked = listing.state === 'Blocked';
	const appealRequested = appealRequest?.state === 'REQUESTED';

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
				}}
				gutter={[0, 24]}
				className="view-listing-responsive"
			>
				{/* Blocked Listing Banner */}
				{isBlocked && (
					<Col span={24} style={{ marginBottom: 16 }}>
						{appealSuccess ? (
							<>
								<Alert
									message="This listing is blocked. Your appeal is awaiting approval."
									type="error"
									showIcon
									action={
										<Button size="small" onClick={() => setBlockInfoModalVisible(true)}>
											View Details
										</Button>
									}
								/>
								<Alert
									message="Appeal requested successfully."
									type="success"
									showIcon
									style={{ marginTop: 8 }}
								/>
							</>
						) : (
							<Alert
								message={
									appealRequested
										? 'This listing is blocked. Your appeal is awaiting approval.'
										: 'This listing is blocked.'
								}
								type="error"
								showIcon
								action={
									<Button size="small" onClick={() => setBlockInfoModalVisible(true)}>
										View Details
									</Button>
								}
							/>
						)}
					</Col>
				)}
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
			{/* Modals */}
			<BlockInformationModal
				visible={blockInfoModalVisible}
				onClose={() => setBlockInfoModalVisible(false)}
				onEditListing={handleEditListing}
				onAppealBlock={handleAppealBlock}
				blockReason={listing.blockReason ?? undefined}
				blockDescription={listing.blockDescription ?? undefined}
				appealRequested={appealRequested}
			/>
			<AppealConfirmationModal
				visible={appealConfirmModalVisible}
				onConfirm={handleAppealConfirm}
				onCancel={() => setAppealConfirmModalVisible(false)}
				loading={appealLoading}
			/>
			{/* TODO: Add login modal here for unauthenticated users attempting to reserve a listing. */}
		</>
	);
};
