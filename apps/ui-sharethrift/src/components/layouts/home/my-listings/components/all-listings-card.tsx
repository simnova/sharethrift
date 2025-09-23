import React from 'react';
import { Card, Tag, Space, Button, Popconfirm, Badge, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './all-listings-card.module.css';
import type { MyListingData } from './my-listings-dashboard.types.ts';
import { getStatusTagClass } from './status-tag-class.ts';

export interface AllListingsCardProps {
	listing: MyListingData;
	onViewPendingRequests: (id: string) => void;
	onAction: (action: string, listingId: string) => void;
}

const AllListingsCard: React.FC<AllListingsCardProps> = ({
	listing,
	onViewPendingRequests,
	onAction,
}) => {
	const getActionButtons = (record: MyListingData) => {
		const buttons = [];

		if (record.status === 'Active' || record.status === 'Reserved') {
			buttons.push(
				<Button
					key="pause"
					type="link"
					size="small"
					onClick={() => onAction('pause', record.id)}
				>
					Pause
				</Button>,
			);
		}

		if (record.status === 'Paused' || record.status === 'Expired') {
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

		if (record.status === 'Blocked') {
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

		if (record.status === 'Draft') {
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

		return buttons;
	};

	return (
		<Card className={styles['listingCard']} styles={{ body: { padding: 0 } }}>
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
						<div>Published On: {listing.publishedAt}</div>
						<div>{listing.reservationPeriod}</div>
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
										count={listing.pendingRequestsCount}
										showZero
										style={{
											backgroundColor:
												listing.pendingRequestsCount > 0
													? '#ff4d4f'
													: '#f5f5f5',
											color:
												listing.pendingRequestsCount > 0 ? 'white' : '#808080',
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
