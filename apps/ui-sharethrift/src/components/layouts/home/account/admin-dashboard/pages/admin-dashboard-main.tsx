import { Tabs } from 'antd';
import { AdminListings } from '../components/admin-listings-table/index.ts';
import { AdminUsers } from '../components/admin-users-table/index.ts';
import styles from './admin-dashboard-main.module.css';
import '@sthrift/ui-components/src/styles/theme.css';

export interface AdminDashboardMainProps {}

export const AdminDashboardMain: React.FC<AdminDashboardMainProps> = () => {
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
