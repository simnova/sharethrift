import { useMemo } from 'react';
import { ListingBanner } from './listing-banner';
import type {ListingBannerProps} from './listing-banner';

// This is a mock container. Replace with a real GraphQL query and data mapping as needed.
interface ListingBannerContainerProps {
  listingId: string;
  owner: string;
}

export function ListingBannerContainer({ listingId, owner }: ListingBannerContainerProps) {
  // Mocked data for demo
  const data: ListingBannerProps = useMemo(() => {
    if (listingId === 'Bike-001') {
      return {
        title: 'City Bike',
        owner,
        period: '1 week (04-JUL-22 / 10-JUL-22)',
        status: 'Request Submitted',
        imageUrl: undefined,
      };
    }
    if (listingId === 'Camera-002') {
      return {
        title: 'Canon Camera',
        owner,
        period: '1 week (04-JUL-22 / 10-JUL-22)',
        status: 'Request Submitted',
        imageUrl: undefined,
      };
    }
    return {
      title: 'Camping Tent',
      owner,
      period: '1 week (04-JUL-22 / 10-JUL-22)',
      status: 'Request Submitted',
      imageUrl: undefined,
    };
  }, [listingId, owner]);

  return <ListingBanner {...data} />;
}
