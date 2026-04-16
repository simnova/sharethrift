import type React from 'react';
import '@sthrift/ui-shared/src/styles/theme.css';
import { AdminUsers } from '../components/admin-users-table/index.ts';
import styles from './admin-user-operations-page.module.css';

export const AdminUserOperationsPage: React.FC = () => {
	return (
		// biome-ignore lint/complexity/useLiteralKeys: CSS module index signature requires bracket notation
		<div className={styles['mainContent']}>
			{/* biome-ignore lint/complexity/useLiteralKeys: CSS module index signature requires bracket notation */}
			<div className={styles['pageHeader']}>
				<h1 className="title42">User Operations</h1>
			</div>
			<AdminUsers />
		</div>
	);
};
