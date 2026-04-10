import { Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styles from './view-listing.module.css';

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
		<Row
			gutter={[0, 24]}
			className={styles.container}
		>
			<Col span={24} className={styles.backButton}>
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
			<Col span={24} className={styles.sharerInfoRow}>
				{sharerInfoSlot}
			</Col>
			<Col span={24} className={styles.mainContentRow}>
				<Row
					gutter={36}
					align="top"
					className={styles.mainContent}
				>
					<Col
						xs={24}
						md={12}
						className={styles.imageColumn}
					>
						{imageGallerySlot}
					</Col>
					<Col xs={24} md={12} className={styles.infoColumn}>
						{listingInfoSlot}
					</Col>
				</Row>
			</Col>
		</Row>
	);
};
