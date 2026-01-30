import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { message } from 'antd';
import { HomeListingInformationCreateReservationRequestDocument,
ViewListingActiveReservationRequestForListingDocument,
ViewListingQueryActiveByListingIdDocument,
type CreateReservationRequestInput,
type ItemListing,
type ViewListingActiveReservationRequestForListingQuery, 
type ViewListingQueryActiveByListingIdQuery,
type ViewListingQueryActiveByListingIdQueryVariables} from '../../../../../../generated';
import { ListingInformation } from './listing-information.tsx';


interface ListingInformationContainerProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	onLoginClick?: () => void;
	onSignUpClick?: () => void;
	className?: string;
}

export const ListingInformationContainer: React.FC<
	ListingInformationContainerProps
> = ({
	listing,
	userIsSharer,
	isAuthenticated,
	userReservationRequest,
	onLoginClick,
	onSignUpClick,
	className,
}) => {
	const [reservationDates, setReservationDates] = useState<{
		startDate: Date | null;
		endDate: Date | null;
	}>({
		startDate: null,
		endDate: null,
	});

	const {
		data: otherReservationsData,
		loading: otherReservationsLoading,
		error: otherReservationsError,
	} = useQuery<
		ViewListingQueryActiveByListingIdQuery,
		ViewListingQueryActiveByListingIdQueryVariables
	>(ViewListingQueryActiveByListingIdDocument, {
		variables: { listingId: listing.id },
		skip: !listing?.id,
		fetchPolicy: 'cache-first',
	});

	const client = useApolloClient();

	const [createReservationRequestMutation, { loading: mutationLoading }] =
		useMutation(HomeListingInformationCreateReservationRequestDocument, {
			onCompleted: () => {
				client.refetchQueries({
					include: [ViewListingActiveReservationRequestForListingDocument],
				});
				setReservationDates({ startDate: null, endDate: null });
			},
			onError: () => {
				// Error handled by Apollo Client
			},
		});

	const handleReserveClick = async () => {
		if (!reservationDates.startDate || !reservationDates.endDate) {
			message.warning(
				'Please select both start and end dates for your reservation',
			);
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
};
