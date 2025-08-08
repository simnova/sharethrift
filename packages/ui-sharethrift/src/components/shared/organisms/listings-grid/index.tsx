import React from 'react';
import { Row, Col, Empty, Pagination } from 'antd';
import { ListingCard } from '../../molecules/listing-card';
import type { ItemListing } from '../../../../types/listing';
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
          imageStyle={{
            height: 60,
          }}
        />
        <p className={styles.emptyDescription}>
          Try adjusting your search or category filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      <Row gutter={[24, 24]} className={styles.grid}>
        {listings.map((listing) => (
          <Col 
            key={listing._id} 
            xs={24} 
            sm={12} 
            md={12} 
            lg={6} 
            xl={6}
            className={styles.gridItem}
          >
            <ListingCard
              listing={listing}
              onClick={() => onListingClick?.(listing)}
            />
          </Col>
        ))}
      </Row>
      
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