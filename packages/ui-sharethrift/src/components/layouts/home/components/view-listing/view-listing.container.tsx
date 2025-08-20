import { useParams } from 'react-router-dom';
import { ViewListing } from './view-listing';
import type { ViewListingProps } from './view-listing';
import { DUMMY_LISTINGS } from '../mock-listings';
import type { ListingStatus, UserRole, ReservationRequestStatus } from './listing-information';

// This is a mock container. Replace with real GraphQL query and data mapping as needed.
interface ViewListingContainerProps {
  // Add any additional props if needed
}

export function ViewListingContainer(_props: ViewListingContainerProps) {
  const { listingId } = useParams<{ listingId: string }>();
  // TODO: Replace with actual GraphQL query using useQuery
  // TODO: Get actual user authentication status and current user ID
  const isAuthenticated = false; // Placeholder - should come from auth context
  const currentUserId = '';
  // Find the correct listing from DUMMY_LISTINGS
  const foundListing = DUMMY_LISTINGS.find(l => l._id === listingId);
  const mockListing = foundListing
    ? {
        id: foundListing._id,
        title: foundListing.title,
        description: foundListing.description,
        price: 25,
        priceUnit: 'per day',
        location: foundListing.location,
        images: foundListing.images ?? [],
        owner: {
          id: foundListing.sharer,
          name: foundListing.sharer,
          avatar: '/api/placeholder/50/50',
          rating: 4.8,
          reviewCount: 23
        },
        category: foundListing.category,
        condition: 'Excellent',
        availableFrom: foundListing.sharingPeriodStart.toISOString(),
        availableTo: foundListing.sharingPeriodEnd.toISOString(),
        status: foundListing.state === 'Published' ? 'Active' : 'Blocked',
        itemName: foundListing.title
      }
    : {
        id: 'notfound',
        title: 'Listing Not Found',
        description: '',
        price: 0,
        priceUnit: '',
        location: '',
        images: [],
        owner: {
          id: '',
          name: '',
          avatar: '',
          rating: 0,
          reviewCount: 0
        },
        category: '',
        condition: '',
        availableFrom: '',
        availableTo: '',
        status: 'Blocked',
        itemName: ''
      };
  let userRole: UserRole = 'logged-out';
  if (isAuthenticated) {
    userRole = currentUserId === mockListing.owner.id ? 'sharer' : 'reserver';
  }
  const reservationRequestStatus: ReservationRequestStatus | undefined = 
    userRole === 'reserver' ? 'pending' : undefined;
  const data: ViewListingProps = {
    listing: mockListing,
    userRole,
    isAuthenticated,
    currentUserId,
    reservationRequestStatus,
    sharedTimeAgo: '2 days ago'
  };
  return <ViewListing {...data} />;
}