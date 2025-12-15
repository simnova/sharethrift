import type React from 'react';
import { Empty, Pagination } from 'antd';
import { ListingCard } from '../../molecules/listing-card/index.js';
import styles from './index.module.css';

export interface UIItemListing {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state?:
		| 'Published'
		| 'Paused'
		| 'Cancelled'
		| 'Drafted'
		| 'Expired'
		| 'Blocked'
		| 'Appeal Requested';
	updatedAt?: Date;
	createdAt?: Date;
	sharingHistory?: string[]; // objectid[]
	reports?: number;
	images?: string[]; // For UI purposes, we'll add image URLs
}

interface ListingsGridProps {
	listings: UIItemListing[];
	loading?: boolean;
	onListingClick?: (listing: UIItemListing) => void;
	currentPage?: number;
	pageSize?: number;
	total?: number;
	onPageChange: (page: number, pageSize: number) => void;
	showPagination?: boolean;
	isOnSearchingPage?: boolean;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
	listings,
	loading = false,
	onListingClick,
	currentPage = 1,
	pageSize = 20,
	total,
	onPageChange,
	showPagination = true,
	isOnSearchingPage = false,
}) => {
	if (!loading && listings.length === 0) {
		return (
			<div className={styles.emptyState}>
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description="No Listings Found"
				/>
				{isOnSearchingPage ? (
					<p className={styles.emptyDescription}>
						Try adjusting your search or category filters to find what you're
						looking for.
					</p>
				) : null}
			</div>
		);
	}

	return (
		<div className={styles.gridContainer}>
			<div className={styles.grid}>
				{listings.map((listing) => (
					<div key={listing.id} className={styles.gridItem}>
						<ListingCard
							listing={listing}
							onClick={() => onListingClick?.(listing)}
						/>
					</div>
				))}
			</div>

			{showPagination && total && total > pageSize && (
				<div className={styles.paginationContainer}>
					<Pagination
						current={currentPage}
						pageSize={pageSize}
						total={total}
						onChange={onPageChange}
						showSizeChanger={false}
					/>
				</div>
			)}
		</div>
	);
};
