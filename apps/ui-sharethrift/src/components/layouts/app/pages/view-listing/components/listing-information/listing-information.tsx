import { ListingInformation as SharedListingInformation } from '@sthrift/ui-shared';
import type { ViewListingActiveReservationRequestForListingQuery, ItemListing, ViewListingQueryActiveByListingIdQuery } from '../../../../../../../generated.tsx';
import { ReservationRequestForm } from '../reservation-request-form.js';

interface ListingInformationProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	onReserveClick?: () => void;
	onLoginClick?: () => void;
	onSignUpClick?: () => void;
	onCancelClick?: () => void;
	className?: string;
	reservationDates?: {
		startDate: Date | null;
		endDate: Date | null;
	};
	onReservationDatesChange?: (dates: {
		startDate: Date | null;
		endDate: Date | null;
	}) => void;
	reservationLoading?: boolean;
	otherReservationsLoading?: boolean;
	otherReservationsError?: Error;
	otherReservations?: ViewListingQueryActiveByListingIdQuery['queryActiveByListingId'];
}

export const ListingInformation: React.FC<ListingInformationProps> = ({
	listing,
	onReserveClick,
	onCancelClick,
	className = '',
	userIsSharer,
	isAuthenticated,
	userReservationRequest,
	reservationDates,
	onReservationDatesChange,
	reservationLoading = false,
	otherReservationsLoading = false,
	otherReservationsError,
	otherReservations,
}) => {
	return (
		<SharedListingInformation
			listing={listing}
			className={className}
			actionSlot={
				<ReservationRequestForm
					userIsSharer={userIsSharer}
					isAuthenticated={isAuthenticated}
					userReservationRequest={userReservationRequest}
					onReserveClick={onReserveClick}
					onCancelClick={onCancelClick}
					reservationDates={reservationDates}
					onReservationDatesChange={onReservationDatesChange}
					reservationLoading={reservationLoading}
					otherReservationsLoading={otherReservationsLoading}
					otherReservationsError={otherReservationsError}
					otherReservations={otherReservations}
				/>
			}
		/>
	);
};
