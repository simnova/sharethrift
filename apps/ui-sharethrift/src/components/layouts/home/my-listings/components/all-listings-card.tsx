import React from 'react';
import { Card, Tag, Space, Button, Popconfirm, Badge, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './all-listings-card.module.css';
import type { HomeAllListingsTableContainerListingFieldsFragment } from '../../../../../generated.tsx';
import { getStatusTagClass } from './status-tag-class.ts';

export interface AllListingsCardProps {
	listing: HomeAllListingsTableContainerListingFieldsFragment;
	onViewPendingRequests: (id: string) => void;
	onAction: (action: string, listingId: string) => void;
}

const AllListingsCard: React.FC<AllListingsCardProps> = ({
	listing,
	onViewPendingRequests,
	onAction,
}) => {
	const getActionButtons = (record: HomeAllListingsTableContainerListingFieldsFragment) => {
		const buttons = [];

		const status = record.state ?? 'Unknown';

		if (status === 'Active' || status === 'Reserved') {
			buttons.push(
				<Popconfirm
					key="pause"
					title="Pause this listing?"
					description="Are you sure you want to pause this listing? It will be removed from search results and marked as inactive until you unpause it."
					onConfirm={() => onAction('pause', record.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small">
						Pause
					</Button>
				</Popconfirm>,
			);
		}

		if (status === 'Paused' || status === 'Expired') {
			buttons.push(
				<Button
					key="reinstate"
					type="link"
					size="small"
					onClick={() => onAction('reinstate', record.id)}
				>
					Reinstate
				</Button>,
			);
		}

		if (status === 'Blocked') {
			buttons.push(
				<Popconfirm
					key="appeal"
					title="Appeal this listing?"
					description="Are you sure you want to appeal the block on this listing?"
					onConfirm={() => onAction('appeal', record.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small">
						Appeal
					</Button>
				</Popconfirm>,
			);
		}

		if (status === 'Draft') {
			buttons.push(
				<Button
					key="publish"
					type="link"
					size="small"
					onClick={() => onAction('publish', record.id)}
				>
					Publish
				</Button>,
			);
		}

		// Cancel button for active listings
		if (status === 'Active' || status === 'Paused') {
			buttons.push(
				<Popconfirm
					key="cancel"
					title="Cancel this listing?"
					description="Are you sure you want to cancel this listing? It will be removed from search results and marked as inactive."
					onConfirm={() => onAction('cancel', record.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small" danger>
						Cancel
					</Button>
				</Popconfirm>,
			);
		}

		return buttons;
	};

	return (
		<Card className={styles['listingCard']} styles={{ body: { padding: 0 } }}>
			<div className={styles['cardRow']}>
				{listing.images?.[0] ? (
					<div className={styles['listingImageWrapper']}>
						<img
							alt={listing.title}
							src={listing.images[0]}
							className={styles['listingImage']}
						/>
						<div className={styles['statusTagOverlay']}>
							<Tag className={getStatusTagClass(listing.state ?? 'Unknown')}>
								{listing.state ?? 'Unknown'}
							</Tag>
						</div>
					</div>
				) : null}
				<div className={styles['cardContent']}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<h3 className={styles['cardTitle']}>{listing.title}</h3>
						<Dropdown
							trigger={['click']}
							overlay={
								<Space direction="vertical" className={styles['dropdown']}>
									<Button
										type="text"
										onClick={() => onAction('edit', listing.id)}
									>
										Edit
									</Button>
									<Popconfirm
										title="Delete this listing?"
										description="Are you sure you want to delete this listing? This action cannot be undone."
										onConfirm={() => onAction('delete', listing.id)}
										okText="Delete"
										cancelText="Cancel"
										placement="bottomRight"
										overlayStyle={{ width: 300 }}
									>
										<Button type="text">Delete</Button>
									</Popconfirm>
								</Space>
							}
							placement="bottomRight"
						>
							<Button type="text" icon={<EllipsisOutlined />} />
						</Dropdown>
					</div>
					<div className={styles['cardMeta']}>
						<div>Published On: {listing.createdAt ? new Date(listing.createdAt).toISOString().slice(0, 10) : 'N/A'}</div>
						<div>
							{listing.sharingPeriodStart && listing.sharingPeriodEnd 
								? `${typeof listing.sharingPeriodStart === 'string' ? listing.sharingPeriodStart.slice(0, 10) : new Date(listing.sharingPeriodStart).toISOString().slice(0, 10)} - ${typeof listing.sharingPeriodEnd === 'string' ? listing.sharingPeriodEnd.slice(0, 10) : new Date(listing.sharingPeriodEnd).toISOString().slice(0, 10)}`
								: 'N/A'
							}
						</div>
					</div>
					<div className={styles['cardActions']}>
						<Space>
							{getActionButtons(listing)}
							<Button
								type="link"
								size="small"
								onClick={() => onViewPendingRequests(listing.id)}
							>
								<span style={{ display: 'flex', alignItems: 'center' }}>
									View Pending Requests
									<Badge
										count={0}
										showZero
										style={{
											backgroundColor: '#f5f5f5',
											color: '#808080',
											fontSize: 12,
											marginLeft: '6px',
										}}
									/>
								</span>
							</Button>
						</Space>
					</div>
				</div>
			</div>
		</Card>
	);
};

export { AllListingsCard };
