import React from 'react';
import { Card } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

export interface ItemListing {
  _id: string;
  sharer: string; // User reference
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  updatedAt?: Date;
  createdAt?: Date;
  sharingHistory?: string[]; // objectid[]
  reports?: number;
  images?: string[]; // For UI purposes, we'll add image URLs
}

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

  return (
    <Link to={`/`} onClick={onClick}> {/* TODO: link to listing */}
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
        styles={{ body: { padding: '0' } }}
      >
        <div className={styles.content}>
          <h3 className={styles.title}>{listing.title}</h3>
          <p className={styles.dateRange}>
            {formatDate(listing.sharingPeriodStart)}
            <SwapRightOutlined style={{ padding: '0 8px' }} />
            {formatDate(listing.sharingPeriodEnd)}
          </p>
          <p className={styles.location}>{listing.location}</p>
        </div>
      </Card>
    </Link>
  );
};