import { Row, Col } from 'antd';
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
	if (listing.state !== 'Active') {
		return (
			<div className="p-4">
				<button
					type="button"
					disabled
					className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
				>
					Listing Not Available
				</button>
			</div>
		);
	}

	return (
		<Row gutter={[0, 12]} style={{ width: '100%' }} className={className}>
			<Col span={24}>
				{/* Title at top, using title42 class */}
				<div className="title42">{listing.title}</div>
			</Col>
			<Col span={24}>
				{/* Location and Category */}
				<Row gutter={16} align="middle">
					<Col
						span={8}
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							height: '100%',
						}}
					>
						<h5 style={{ marginBottom: 8, marginTop: 0, lineHeight: '18px' }}>
							Located in
						</h5>
						<h5 style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}>
							Category
						</h5>
					</Col>
					<Col
						span={16}
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							height: '100%',
						}}
					>
						<div
							className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]"
							style={{ marginBottom: 8, marginTop: 0, lineHeight: '18px' }}
						>
							<p style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}>
								{listing.location}
							</p>
						</div>
						<div
							className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]"
							style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}
						>
							<p style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}>
								{listing.category}
							</p>
						</div>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				{/* Description */}
				<Row>
					<Col span={24}>
						<div
							className="font-urbanist text-[14px] text-[#333333] w-full max-w-[499px]"
							style={{ marginBottom: 8 }}
						>
							<p style={{ marginBottom: 8 }}>{listing.description}</p>
						</div>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
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
			</Col>
		</Row>
	);
};
