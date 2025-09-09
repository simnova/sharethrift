import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { message } from 'antd';
import { ListingInformation } from './listing-information';
import type { ListingInformationProps, ListingStatus } from './listing-information';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ListingInformationQuerySource from './listing-information.graphql?raw';
import type { CreateReservationRequestInput } from '../../../../../../generated';

const GET_LISTING_INFORMATION = gql(ListingInformationQuerySource);

interface ItemListing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  state: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
}

interface ListingQueryResponse {
  itemListing: ItemListing;
}

interface ListingInformationContainerProps {
  listingId: string;
  userRole: ListingInformationProps['userRole'];
  isAuthenticated: boolean;
  reservationRequestStatus?: ListingInformationProps['reservationRequestStatus'];
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  className?: string;
}

// Map backend ItemListingState to frontend ListingStatus
function mapListingStateToStatus(state: string): ListingStatus {
  switch (state) {
    case 'Published':
      return 'Active';
    case 'Paused':
      return 'Paused';
    case 'Blocked':
      return 'Blocked';
    case 'Cancelled':
      return 'Cancelled';
    case 'Expired':
      return 'Expired';
    case 'Drafted':
      return 'Cancelled'; 
    case 'Appeal_Requested':
      return 'Blocked'; 
    default:
      return 'Active'; 
  }
}

export default function ListingInformationContainer({
  listingId,
  userRole,
  isAuthenticated,
  reservationRequestStatus,
  onLoginClick,
  onSignUpClick,
  className
}: ListingInformationContainerProps) {
  const [reservationDates, setReservationDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });

  const { data, loading, error } = useQuery<ListingQueryResponse>(
    GET_LISTING_INFORMATION,
    {
      variables: { listingId },
    }
  );

  const [createReservationRequestMutation, { loading: mutationLoading }] = useMutation(
    gql`
      mutation HomeListingInformationCreateReservationRequest($input: CreateReservationRequestInput!) {
        createReservationRequest(input: $input) {
          id
          state
          reservationPeriodStart
          reservationPeriodEnd
          createdAt
          updatedAt
        }
      }
    `,
    {
      onCompleted: () => {
        message.success('Reservation request created successfully!');
        // Clear the selected dates after successful reservation
        setReservationDates({ startDate: null, endDate: null });
      },
      onError: (error) => {
        message.error(error.message || 'Failed to create reservation request');
      },
    }
  );

  const handleReserveClick = async () => {
    if (!isAuthenticated) {
      message.warning('Please log in to make a reservation');
      return;
    }

    if (!reservationDates.startDate || !reservationDates.endDate) {
      message.warning('Please select both start and end dates for your reservation');
      return;
    }

    try {
      await createReservationRequestMutation({
        variables: {
          input: {
            listingId,
            reservationPeriodStart: reservationDates.startDate.toISOString(),
            reservationPeriodEnd: reservationDates.endDate.toISOString(),
          } as CreateReservationRequestInput,
        },
      });
    } catch (error) {
      console.error('Error creating reservation request:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading listing information</div>;
  if (!data?.itemListing) return <div>Listing not found</div>;

  // Map backend ItemListing to ListingInformationProps.listing shape
  const mappedListing: ListingInformationProps['listing'] = {
    id: data.itemListing.id,
    title: data.itemListing.title,
    description: data.itemListing.description,
    category: data.itemListing.category,
    location: data.itemListing.location,
    status: mapListingStateToStatus(data.itemListing.state),
    availableFrom: new Date(data.itemListing.sharingPeriodStart).toISOString().slice(0, 10),
    availableTo: new Date(data.itemListing.sharingPeriodEnd).toISOString().slice(0, 10),
  };

  return (
    <ListingInformation
      listing={mappedListing}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      reservationRequestStatus={reservationRequestStatus}
      onReserveClick={handleReserveClick}
      onLoginClick={onLoginClick}
      onSignUpClick={onSignUpClick}
      className={className}
      reservationDates={reservationDates}
      onReservationDatesChange={setReservationDates}
      reservationLoading={mutationLoading}
    />
  );
}

