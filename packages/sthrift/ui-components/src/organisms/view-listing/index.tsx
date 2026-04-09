import { Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface ViewListingListing {
	id: string;
	sharer?: { id: string } | null;
}

interface ViewListingProps {
	listing: ViewListingListing;
	currentUserId?: string | null;
	sharedTimeAgo?: string;
	sharerInfoSlot: React.ReactNode;
	imageGallerySlot: React.ReactNode;
	listingInfoSlot: React.ReactNode;
}

export const ViewListing: React.FC<ViewListingProps> = ({
	sharerInfoSlot,
	imageGallerySlot,
	listingInfoSlot,
}) => {
	const handleBack = () => {
		window.location.href = '/';
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
				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					{sharerInfoSlot}
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
							{imageGallerySlot}
						</Col>
						{/* Right: Listing details */}
						<Col xs={24} md={12} style={{ marginTop: 0, paddingTop: 0 }}>
							{listingInfoSlot}
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
};
