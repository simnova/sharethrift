import React from 'react';
import { Card } from 'antd';
import type { ItemListing } from '../../../../types/listing';
import styles from './index.module.css';

export interface ListingCardProps {
  listing: ItemListing;
  onClick?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const formatDate = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${formatDate(start)} → ${formatDate(end)}`;
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