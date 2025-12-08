import { Row, Col, Button, Alert } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ListingImageGalleryContainer } from './listing-image-gallery/listing-image-gallery.container.tsx';
import { SharerInformationContainer } from './sharer-information/sharer-information.container.tsx';
import { ListingInformationContainer } from './listing-information/listing-information.container.tsx';
import { BlockListingModal } from './block-listing-modal.tsx';
import { UnblockListingModal } from './unblock-listing-modal.tsx';
import type {
	ItemListing,
	ViewListingActiveReservationRequestForListingQuery,
} from '../../../../../generated.tsx';

export interface ViewListingProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	currentUserId?: string | null;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	sharedTimeAgo?: string;
	isAdmin: boolean;
	onBlockListing: (reason: string, description: string) => Promise<void>;
	onUnblockListing: () => Promise<void>;
	blockLoading: boolean;
	unblockLoading: boolean;
}

export const ViewListing: React.FC<ViewListingProps> = ({
	listing,
	userIsSharer,
	isAuthenticated,
	currentUserId,
	userReservationRequest,
	sharedTimeAgo,
	isAdmin,
	onBlockListing,
	onUnblockListing,
	blockLoading,
	unblockLoading,
}) => {
	const [blockModalVisible, setBlockModalVisible] = useState(false);
	const [unblockModalVisible, setUnblockModalVisible] = useState(false);

	// Mock sharer info (since ItemListing.sharer is just an ID)
	const sharer = listing.sharer;

	const isBlocked = listing.state === 'Blocked';

	const handleBack = () => {
		window.location.href = '/';
	};

	const handleBlockConfirm = async (reason: string, description: string) => {
		await onBlockListing(reason, description);
		setBlockModalVisible(false);
	};

	const handleUnblockConfirm = async () => {
		await onUnblockListing();
		setUnblockModalVisible(false);
	};

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
					opacity: isBlocked && !isAdmin ? 0.5 : 1,
					pointerEvents: isBlocked && !isAdmin ? 'none' : 'auto',
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
				{isBlocked && (
					<Col span={24}>
						<Alert
							message="This listing is currently blocked"
							description="This listing has been blocked by an administrator and is not visible to regular users."
							type="error"
							showIcon
						/>
					</Col>
				)}
				{isAdmin && (
					<Col span={24}>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
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
			<BlockListingModal
				visible={blockModalVisible}
				listingTitle={listing.title}
				onConfirm={handleBlockConfirm}
				onCancel={() => setBlockModalVisible(false)}
				loading={blockLoading}
			/>
			<UnblockListingModal
				visible={unblockModalVisible}
				listingTitle={listing.title}
				listingSharer={sharer?.id || 'Unknown'}
				onConfirm={handleUnblockConfirm}
				onCancel={() => setUnblockModalVisible(false)}
				loading={unblockLoading}
			/>
			{/* TODO: Add login modal here for unauthenticated users attempting to reserve a listing. */}
		</>
	);
};
