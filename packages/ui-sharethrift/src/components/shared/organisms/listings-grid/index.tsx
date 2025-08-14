import React from 'react';
import { Empty, Pagination, Button, Spin } from 'antd';
import { ListingCard } from '../../molecules/listing-card';
import type { ItemListing } from '../../../../types/listing';
import styles from './index.module.css';

export interface ListingsGridProps {
  listings: ItemListing[];
  loading?: boolean;
  onListingClick?: (listing: ItemListing) => void;
  // Legacy pagination props
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize?: number) => void;
  showPagination?: boolean;
  // New infinite scroll props
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  loading = false,
  onListingClick,
  // Legacy pagination props
  currentPage = 1,
  pageSize = 12,
  total,
  onPageChange,
  showPagination = false, // Default to false, prefer infinite scroll
  // New infinite scroll props
  hasNextPage = false,
  onLoadMore,
  totalCount,
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

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      )}

      {/* Load More button for infinite scroll */}
      {!loading && hasNextPage && onLoadMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button 
            type="primary" 
            onClick={onLoadMore}
            size="large"
          >
            Load More Listings
          </Button>
        </div>
      )}

      {/* Legacy pagination - fallback */}
      {showPagination && !onLoadMore && total && total > pageSize && (
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