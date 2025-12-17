import { Button, Card, Popconfirm, Space, Tag } from 'antd';
import styles from './all-listings-card.module.css';
import type { ListingRequestData } from './my-listings-dashboard.types.tsx';

interface RequestsCardProps {
	listing: ListingRequestData;
	onAccept: (requestId: string) => Promise<void>;
	onReject: (requestId: string) => void;
	onClose: (requestId: string) => void;
	onDelete: (requestId: string) => void;
	onMessage: (requestId: string) => void;
}

const RequestsCard: React.FC<RequestsCardProps> = ({
	listing,
	onAccept,
	onReject,
	onClose,
	onDelete,
	onMessage,
}) => {
	let statusClass = '';
	switch (listing.status) {
		case 'Accepted':
			statusClass = 'requestAcceptedTag';
			break;
		case 'Rejected':
			statusClass = 'requestRejectedTag';
			break;
		case 'Closed':
			statusClass = 'expiredTag';
			break;
		case 'Pending':
		case 'Requested':
			statusClass = 'pendingTag';
			break;
		case 'Closing':
			statusClass = 'closingTag';
			break;
		case 'Expired':
			statusClass = 'expiredTag';
			break;
	}

	let actions: string[] = [];
	switch (listing.status) {
		case 'Pending':
		case 'Requested':
			actions = ['accept', 'reject'];
			break;
		case 'Accepted':
			actions = ['close', 'message'];
			break;
		case 'Closed':
			actions = ['message'];
			break;
		case 'Rejected':
		case 'Expired':
		case 'Cancelled':
			actions = ['delete'];
			break;
	}

	const actionButtons = actions.map((action) => {
		if (action === 'accept') {
			return (
				<Button
					key="accept"
					type="link"
					size="small"
					onClick={() => onAccept(listing.id)}
				>
					Accept
				</Button>
			);
		}
		if (action === 'reject') {
			return (
				<Button
					key="reject"
					type="link"
					size="small"
					onClick={() => onReject(listing.id)}
				>
					Reject
				</Button>
			);
		}
		if (action === 'close') {
			return (
				<Popconfirm
					key="close"
					title="Close this request?"
					description="Are you sure you want to close this request?"
					onConfirm={() => onClose(listing.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small">
						Close
					</Button>
				</Popconfirm>
			);
		}
		if (action === 'message') {
			return (
				<Button
					key="message"
					type="link"
					size="small"
					onClick={() => onMessage(listing.id)}
				>
					Message
				</Button>
			);
		}
		if (action === 'delete') {
			return (
				<Popconfirm
					key="delete"
					title="Delete this request?"
					description="Are you sure you want to delete this request? This action cannot be undone."
					onConfirm={() => onDelete(listing.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small" danger>
						Delete
					</Button>
				</Popconfirm>
			);
		}
		return null;
	});

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
							<Tag className={statusClass}>
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
						<Space>{actionButtons}</Space>
					</div>
				</div>
			</div>
		</Card>
	);
};

export { RequestsCard };
