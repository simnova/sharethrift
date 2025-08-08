import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { UserOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MockListing } from '../../../../data/mockListings';

const { Meta } = Card;
const { Text } = Typography;

export interface ListingCardProps {
  listing: MockListing;
  onClick?: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const handleClick = () => {
    onClick?.(listing._id);
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endDate = new Date(end).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${startDate} - ${endDate}`;
  };

  return (
    <Card
      hoverable
      className="h-full cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      cover={
        <div className="h-48 overflow-hidden">
          <img
            alt={listing.title}
            src={listing.image}
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>
      }
      onClick={handleClick}
    >
      <Meta
        title={
          <div className="truncate" title={listing.title}>
            {listing.title}
          </div>
        }
        description={
          <div className="space-y-2">
            <Tag color="blue" className="mb-2">
              {listing.category}
            </Tag>
            
            <div className="flex items-center text-gray-600 text-sm">
              <EnvironmentOutlined className="mr-1" />
              <Text className="truncate">{listing.location}</Text>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <CalendarOutlined className="mr-1" />
              <Text className="text-xs">
                {formatDateRange(listing.sharingPeriodStart, listing.sharingPeriodEnd)}
              </Text>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <UserOutlined className="mr-1" />
              <Text>
                {listing.sharer.firstName} {listing.sharer.lastName.charAt(0)}.
              </Text>
            </div>
          </div>
        }
      />
    </Card>
  );
};