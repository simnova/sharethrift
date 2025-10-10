import { Tabs } from 'antd';
import { AdminListings } from '../components/admin-listings.tsx';
import { AdminUsers } from '../components/admin-users.tsx';
import styles from './admin-dashboard-main.module.css';
import '@sthrift/ui-components/src/styles/theme.css';

export interface AdminDashboardMainProps {}

export function AdminDashboardMain() {
	const tabItems = [
		{
			key: 'listings',
			label: 'Listings',
			children: <AdminListings />,
		},
		{
			key: 'users',
			label: 'Users',
			children: <AdminUsers />,
		},
	];

	return (
		<div className={styles['mainContent']}>
			<div className={styles['pageHeader']}>
				<h1 className="title42">Admin Dashboard</h1>
			</div>
			<Tabs defaultActiveKey="listings" items={tabItems} />
		</div>
	);
}

export default AdminDashboardMain;
