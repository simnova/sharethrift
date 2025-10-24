import { Row, Col, Button, Alert } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { ListingImageGalleryContainer } from './listing-image-gallery/listing-image-gallery.container.tsx';
import { SharerInformationContainer } from './sharer-information/sharer-information.container.tsx';
import { ListingInformationContainer } from './listing-information/listing-information.container.tsx';
import type {
	ItemListing,
	ViewListingActiveReservationRequestForListingQuery,
} from '../../../../../generated.tsx';

export interface ViewListingProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	sharedTimeAgo?: string;
}

export const ViewListing: React.FC<ViewListingProps> = ({
	listing,
	userIsSharer,
	isAuthenticated,
	userReservationRequest,
	sharedTimeAgo,
}) => {
	// Mock sharer info (since ItemListing.sharer is just an ID)
	const sharer = listing.sharer;
	// Get userId from localStorage if available
	const userId =
		typeof window !== 'undefined'
			? window.localStorage.getItem('userId')
			: undefined;
	const handleBack = () => {
		window.location.href = '/';
	};

	const isExpired = listing.state === 'Expired';

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
			{userIsSharer && isExpired && (
				<Col span={24} style={{ marginTop: 16, marginBottom: 0, paddingBottom: 0 }}>
					<Alert
						type="warning"
						message="This listing has expired."
						banner
					/>
				</Col>
			)}
				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					{/* Sharer Info at top, clickable to profile */}
					<a
						href={`/account/profile`}
						style={{
							textDecoration: 'none',
							color: 'inherit',
							cursor: 'pointer',
							display: 'block',
						}}
						aria-label="View sharer profile"
					>
						<SharerInformationContainer
							sharerId={sharer?.id}
							listingId={listing.id}
							isOwner={sharer?.id === userId}
							className="sharer-info-responsive"
							sharedTimeAgo={sharedTimeAgo}
						/>
					</a>
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
			{/* TODO: Add login modal here for unauthenticated users attempting to reserve a listing. */}
		</>
	);
}
