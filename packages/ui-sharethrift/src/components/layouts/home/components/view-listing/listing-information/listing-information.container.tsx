import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { message } from 'antd';
import { ListingInformation } from './listing-information';

// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import { 
    HomeListingInformationCreateReservationRequestDocument, 
    type CreateReservationRequestInput, 
    ViewListingCurrentUserDocument, 
    type ViewListingCurrentUserQuery,
    ViewListingQueryActiveByListingIdDocument, 
    type ViewListingQueryActiveByListingIdQuery, 
    type ViewListingQueryActiveByListingIdQueryVariables,
    ViewListingActiveReservationRequestForListingDocument,
    type ItemListing,
    type ViewListingActiveReservationRequestForListingQuery
} from '../../../../../../generated';

interface ListingInformationContainerProps {
  listing: ItemListing;
  userIsSharer: boolean;
  isAuthenticated: boolean;
  userReservationRequest: ViewListingActiveReservationRequestForListingQuery["myActiveReservationForListing"] | null;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  className?: string;
}

// Map backend ItemListingState to frontend ListingStatus
// function mapListingStateToStatus(state: string | null | undefined): ListingStatus {
//   switch (state) {
//     case 'Published':
//       return 'Active';
//     case 'Paused':
//       return 'Paused';
//     case 'Blocked':
//       return 'Blocked';
//     case 'Cancelled':
//       return 'Cancelled';
//     case 'Expired':
//       return 'Expired';
//     case 'Drafted':
//       return 'Cancelled'; 
//     case 'Appeal_Requested':
//       return 'Blocked'; 
//     default:
//       return 'Active'; 
//   }
// }

export default function ListingInformationContainer({
  listing,
  userIsSharer,
  isAuthenticated,
  userReservationRequest,
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

  const { data: otherReservationsData, loading: otherReservationsLoading, error: otherReservationsError } = useQuery<ViewListingQueryActiveByListingIdQuery, ViewListingQueryActiveByListingIdQueryVariables>(
    ViewListingQueryActiveByListingIdDocument,
    {
      variables: { listingId: listing.id },
      skip: !listing?.id,
      fetchPolicy: 'cache-first',
    }
  );

  if (otherReservationsData) { console.log("Other reservations data:", otherReservationsData); }
  
  const { data: currentUserData } = useQuery<ViewListingCurrentUserQuery>(ViewListingCurrentUserDocument);
  if (!currentUserData?.currentPersonalUserAndCreateIfNotExists) {console.log("Current user could not be created or not found:");}

  const client = useApolloClient();

  const [createReservationRequestMutation, { loading: mutationLoading }] = useMutation(
    HomeListingInformationCreateReservationRequestDocument,
    {
      onCompleted: () => {
        client.refetchQueries({
          include: [ViewListingActiveReservationRequestForListingDocument],
        });
        setReservationDates({ startDate: null, endDate: null });
      },
      onError: (error) => {
        console.log(error.message || 'Failed to create reservation request');
      },
    }
  );

  const handleReserveClick = async () => {
    if (!reservationDates.startDate || !reservationDates.endDate) {
      message.warning('Please select both start and end dates for your reservation');
      return;
    }
    try {
      await createReservationRequestMutation({
        variables: {
          input: {
            listingId: listing.id,
            reservationPeriodStart: reservationDates.startDate.toISOString(),
            reservationPeriodEnd: reservationDates.endDate.toISOString(),
          } as CreateReservationRequestInput,
        },
      });
    } catch (error) {
      console.error('Error creating reservation request:', error);
    }
  };

  return (
    <ListingInformation
      listing={listing}
      userIsSharer={userIsSharer}
      isAuthenticated={isAuthenticated}
      userReservationRequest={userReservationRequest}
      onReserveClick={handleReserveClick}
      onLoginClick={onLoginClick}
      onSignUpClick={onSignUpClick}
      className={className}
      reservationDates={reservationDates}
      onReservationDatesChange={setReservationDates}
      reservationLoading={mutationLoading}
      otherReservationsLoading={otherReservationsLoading}
      otherReservationsError={otherReservationsError}
      otherReservations={otherReservationsData?.queryActiveByListingId}
    />
  );
}

