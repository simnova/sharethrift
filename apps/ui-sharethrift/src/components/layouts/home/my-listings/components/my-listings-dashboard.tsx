import { Button, Tabs, Badge } from 'antd';
import type { TabsProps } from 'antd';
import { AllListingsTableContainer } from './all-listings-table.container.tsx';
import { RequestsTableContainer } from './requests-table.container.tsx';
import { useState } from 'react';
import styles from './my-listings-dashboard.module.css';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
// import MyListingsQuerySource from './my-listings-dashboard.container.graphql?raw';

export interface MyListingsDashboardProps {
	onCreateListing: () => void;
	requestsCount: number;
}

export function MyListingsDashboard({
	onCreateListing,
	requestsCount,
}: MyListingsDashboardProps) {
	const [activeTab, setActiveTab] = useState('all-listings');
	const [allListingsPage, setAllListingsPage] = useState(1);
	const [requestsPage, setRequestsPage] = useState(1);

	const handleTabChange = (key: string) => {
		setActiveTab(key);
		// Reset the page for the tab being switched to
		if (key === 'all-listings') {
			setAllListingsPage(1);
		}
		if (key === 'requests') {
			setRequestsPage(1);
		}
	};

	const items: TabsProps['items'] = [
		{
			key: 'all-listings',
			label: 'All Listings',
			children: (
				<AllListingsTableContainer
					currentPage={allListingsPage}
					onPageChange={setAllListingsPage}
				/>
			),
		},
		{
			key: 'requests',
			label: (
				<span style={{ display: 'flex', alignItems: 'center' }}>
					Requests
					<Badge
						count={requestsCount}
						showZero
						style={{
							backgroundColor: requestsCount > 0 ? '#ff4d4f' : '#f5f5f5',
							color: requestsCount > 0 ? 'white' : '#808080',
							fontSize: 12,
							marginLeft: '6px',
						}}
					/>
				</span>
			),
			children: (
				<RequestsTableContainer
					currentPage={requestsPage}
					onPageChange={setRequestsPage}
				/>
			),
		},
	];

	return (
		<div className={styles['dashboardContainer']}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '24px',
				}}
			>
				<h1 className="title42" style={{ margin: 0 }}>
					My Listings
				</h1>
				<Button
					type="primary"
					size="large"
					onClick={onCreateListing}
					className={styles['createListing']}
				>
					Create a Listing
				</Button>
			</div>

			<Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />
		</div>
	);
}
