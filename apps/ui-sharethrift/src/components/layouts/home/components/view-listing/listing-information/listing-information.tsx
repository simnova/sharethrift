import { Row, Col, DatePicker, Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type {
	ViewListingQueryActiveByListingIdQuery,
	ItemListing,
	ViewListingActiveReservationRequestForListingQuery,
} from '../../../../../../generated.tsx';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Manual isBetween logic for Dayjs
function isBetweenManual(
	date: Dayjs,
	start: Dayjs,
	end: Dayjs,
	unit: dayjs.OpUnitType = 'millisecond',
	inclusive: '()' | '[]' | '[)' | '(]' = '()',
): boolean {
	const isAfterStart = inclusive.startsWith('[')
		? date.isSame(start, unit) || date.isAfter(start, unit)
		: date.isAfter(start, unit);
	const isBeforeEnd = inclusive.endsWith(']')
		? date.isSame(end, unit) || date.isBefore(end, unit)
		: date.isBefore(end, unit);
	return isAfterStart && isBeforeEnd;
}
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
	cancelLoading?: boolean;
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
	cancelLoading = false,
	otherReservationsLoading = false,
	otherReservationsError,
	otherReservations,
}) => {
	const navigate = useNavigate();
	const [dateSelectionError, setDateSelectionError] = useState<string | null>(
		null,
	);

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

	// Check if dates are selected for enabling the Reserve button
	const areDatesSelected =
		reservationDates?.startDate && reservationDates?.endDate;

	console.log('is authenticated', isAuthenticated);
	console.log(
		'user reservation request',
		userReservationRequest?.reservationPeriodEnd,
	);

	const handleDateRangeChange = (
		dates: [Dayjs | null, Dayjs | null] | null,
	): void => {
		if (!onReservationDatesChange) {
			return;
		}
		if (!dates?.[0] || !dates?.[1]) {
			onReservationDatesChange({ startDate: null, endDate: null });
			return;
		}
		const [start, end] = dates;
		if (start.isBefore(dayjs().startOf('day'))) {
			setDateSelectionError('Selected date range is before today.');
			onReservationDatesChange({ startDate: null, endDate: null });
			return;
		}

		const isRangeValid = (startDate: Dayjs, endDate: Dayjs): boolean => {
			if (otherReservationsError || !otherReservations) {
				return true;
			}
			let currentDate = startDate.clone();
			while (
				currentDate.isBefore(endDate, 'day') ||
				currentDate.isSame(endDate, 'day')
			) {
				const isDisabled = otherReservations.some((otherRes) => {
					const otherResStart = dayjs(Number(otherRes?.reservationPeriodStart));
					const otherResEnd = dayjs(Number(otherRes?.reservationPeriodEnd));
					return isBetweenManual(
						currentDate,
						otherResStart,
						otherResEnd,
						'day',
						'[]',
					);
				});
				if (isDisabled) {
					return false;
				}
				currentDate = currentDate.add(1, 'day');
			}
			return true;
		};

		if (!isRangeValid(start, end)) {
			setDateSelectionError(
				'Selected date range overlaps with existing reservations.',
			);
			return;
		}

		setDateSelectionError(null);
		onReservationDatesChange({
			startDate: start.toDate(),
			endDate: end.toDate(),
		});
		console.log('Selected dates:', dates);
	};

	const reservationRequestStatus = userReservationRequest?.state ?? null;
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
				{/* Reservation Period Section - Only show if authenticated */}
				<Row style={{ marginTop: 16 }}>
					<Col span={24}>
						{(() => {
							if (otherReservationsLoading) {
								return (
									<LoadingOutlined style={{ fontSize: 24, marginBottom: 8 }} />
								);
							}

							if (!isAuthenticated) {
								return null;
							}

							return (
								<>
									<h3 style={{ marginBottom: 8 }}>Reservation Period</h3>
									<DatePicker.RangePicker
										style={{ width: '100%' }}
										placeholder={['Start date', 'End date']}
										allowClear
										onChange={handleDateRangeChange}
										value={
											userReservationRequest?.reservationPeriodStart != null &&
											userReservationRequest?.reservationPeriodEnd
												? [
														dayjs(
															Number(
																userReservationRequest.reservationPeriodStart,
															),
														),
														dayjs(
															Number(
																userReservationRequest.reservationPeriodEnd,
															),
														),
													]
												: [
														reservationDates?.startDate
															? dayjs(reservationDates.startDate)
															: null,
														reservationDates?.endDate
															? dayjs(reservationDates.endDate)
															: null,
													]
										}
										disabled={reservationRequestStatus !== null}
										disabledDate={(current) => {
											// Disable dates that overlap with other active reservations
											if (current.isBefore(dayjs().startOf('day'))) {
												return true;
											}
											if (otherReservationsError || !otherReservations) {
												return false;
											}
											return otherReservations.some((reservation) => {
												const resStart = dayjs(
													Number(reservation?.reservationPeriodStart),
												);
												const resEnd = dayjs(
													Number(reservation?.reservationPeriodEnd),
												);
												return isBetweenManual(
													current,
													resStart,
													resEnd,
													'day',
													'[]',
												);
											});
										}}
									/>
									<div style={{ color: 'red', marginTop: 8 }}>
										{dateSelectionError}
									</div>
								</>
							);
						})()}
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				{/* Reserve Button - Only show if authenticated */}
				<Row>
					<Col span={24}>
						{(() => {
							if (!userIsSharer && isAuthenticated) {
								if (reservationRequestStatus === 'Requested') {
									return (
										<Popconfirm
											title="Cancel Reservation Request"
											description="Are you sure you want to cancel this request?"
											onConfirm={onCancelClick}
											okText="Yes"
											cancelText="No"
										>
											<Button type="default" block loading={cancelLoading}>
												Cancel Request
											</Button>
										</Popconfirm>
									);
								}
								return (
									<Button
										type="primary"
										block
										onClick={onReserveClick}
										disabled={!areDatesSelected}
										icon={reservationLoading ? <LoadingOutlined /> : undefined}
									>
										Reserve
									</Button>
								);
							}

							if (!isAuthenticated) {
								return (
									<Button
										type="primary"
										block
										onClick={() => navigate('/signup/select-account-type')}
									>
										Log in to Reserve
									</Button>
								);
							}

							return null;
						})()}
					</Col>
				</Row>
			</Col>
		</Row>
	);
};
