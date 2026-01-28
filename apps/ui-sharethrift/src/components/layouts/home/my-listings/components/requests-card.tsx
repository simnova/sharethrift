import { Card, Tag, Space } from 'antd';
import styles from './all-listings-card.module.css';
import type { ListingRequestData } from './my-listings-dashboard.types.ts';
import {
	getStatusTagClass,
	getActionButtons,
} from './requests-status-helpers.tsx';

interface RequestsCardProps {
	listing: ListingRequestData;
	onAction: (action: string, listingId: string) => void;
}

const RequestsCard: React.FC<RequestsCardProps> = ({ listing, onAction }) => {
	return (
		<Card
			className={styles['listingCard']}
			styles={{ body: { padding: 0, background: 'var(--color-background)' } }}
		>
			<div className={styles['cardRow']}>
				{listing.image ? (
					<div className={styles['listingImageWrapper']}>
						<img
							alt={listing.title}
							src={listing.image}
							className={styles['listingImage']}
						/>
						<div className={styles['statusTagOverlay']}>
							<Tag className={getStatusTagClass(listing.status)}>
								{listing.status}
							</Tag>
						</div>
					</div>
				) : null}
				<div className={styles['cardContent']}>
					<h3 className={styles['cardTitle']}>{listing.title}</h3>
					<div className={styles['cardMeta']}>
						<div>
							Requested on {listing.requestedOn} by {listing.requestedBy}
						</div>
						<div>{listing.reservationPeriod}</div>
					</div>
					<div className={styles['cardActions']}>
						<Space>{getActionButtons(listing, onAction)}</Space>
					</div>
				</div>
			</div>
		</Card>
	);
};

export { RequestsCard };
