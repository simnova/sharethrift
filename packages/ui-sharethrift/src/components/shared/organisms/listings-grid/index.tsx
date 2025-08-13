import React from 'react';
import { Empty, Pagination } from 'antd';
import { ListingCard } from '../../molecules/listing-card';
import type { ItemListing } from '../../../../components/layouts/home/components/mock-listings';
import styles from './index.module.css';

export interface ListingsGridProps {
  listings: ItemListing[];
  loading?: boolean;
  onListingClick?: (listing: ItemListing) => void;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize?: number) => void;
  showPagination?: boolean;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  loading = false,
  onListingClick,
  currentPage = 1,
  pageSize = 12,
  total,
  onPageChange,
  showPagination = true,
}) => {
  if (!loading && listings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No Listings Found"
        />
        <p className={styles.emptyDescription}>
          Try adjusting your search or category filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {listings.map((listing) => (
          <div key={listing._id} className={styles.gridItem}>
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
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} listings`
            }
          />
        </div>
      )}
    </div>
  );
};