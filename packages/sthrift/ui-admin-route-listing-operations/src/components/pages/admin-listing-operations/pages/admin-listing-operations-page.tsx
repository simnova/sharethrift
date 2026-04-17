import type React from 'react';
import '@sthrift/ui-shared/src/styles/theme.css';
import { AdminListings } from '../components/admin-listings-table/index.ts';
import styles from './admin-listing-operations-page.module.css';

export const AdminListingOperationsPage: React.FC = () => {
	return (
		// biome-ignore lint/complexity/useLiteralKeys: CSS module index signature requires bracket notation
		<div className={styles['mainContent']}>
			{/* biome-ignore lint/complexity/useLiteralKeys: CSS module index signature requires bracket notation */}
			<div className={styles['pageHeader']}>
				<h1 className="title42">Listing Operations</h1>
			</div>
			<AdminListings />
		</div>
	);
};
