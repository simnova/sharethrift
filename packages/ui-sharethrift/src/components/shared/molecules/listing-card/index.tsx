import React from 'react';
import { Card } from 'antd';
import type { ItemListing } from '../../../../types/listing';
import styles from './index.module.css';

export interface ListingCardProps {
  listing: ItemListing;
  onClick?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return `${startStr} → ${endStr}`;
  };

  return (
    <Card
      className={styles.listingCard}
      cover={
        <div className={styles.imageContainer}>
          <img
            alt={listing.title}
            src={listing.images?.[0] || '/placeholder.jpg'}
            className={styles.image}
            loading="lazy"
          />
        </div>
      }
      onClick={onClick}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{listing.title}</h3>
        <p className={styles.dateRange}>
          {formatDateRange(listing.sharingPeriodStart, listing.sharingPeriodEnd)}
        </p>
        <p className={styles.location}>{listing.location}</p>
      </div>
    </Card>
  );
};