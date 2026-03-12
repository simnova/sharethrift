import Row from 'antd/es/row';
import Col from 'antd/es/col';
import DatePicker from 'antd/es/date-picker';
import Button from 'antd/es/button';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ViewListingActiveReservationRequestForListingQuery, ViewListingQueryActiveByListingIdQuery } from '../../../../../../generated.tsx';

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

interface ReservationRequestFormProps {
	userIsSharer: boolean;
	isAuthenticated: boolean;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	onReserveClick?: () => void;
	onCancelClick?: () => void;
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

export const ReservationRequestForm: React.FC<ReservationRequestFormProps> = ({
	userIsSharer,
	isAuthenticated,
	userReservationRequest,
	onReserveClick,
	onCancelClick,
	reservationDates,
	onReservationDatesChange,
	reservationLoading = false,
	otherReservationsLoading = false,
	otherReservationsError,
	otherReservations,
}) => {
	const navigate = useNavigate();
	const [dateSelectionError, setDateSelectionError] = useState<string | null>(null);

	// Check if dates are selected for enabling the Reserve button
	const areDatesSelected = reservationDates?.startDate && reservationDates?.endDate;

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
	};

	const reservationRequestStatus = userReservationRequest?.state ?? null;

	return (
		<>
			<Col span={24}>
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
								return (
									<Button
										type={
											reservationRequestStatus === 'Requested'
												? 'default'
												: 'primary'
										}
										style={{ width: '100%' }}
										onClick={
											reservationRequestStatus === 'Requested'
												? onCancelClick
												: onReserveClick
										}
										disabled={
											!areDatesSelected &&
											reservationRequestStatus !== 'Requested'
										}
										icon={reservationLoading ? <LoadingOutlined /> : undefined}
									>
										{reservationRequestStatus === 'Requested'
											? 'Cancel Request'
											: 'Reserve'}
									</Button>
								);
							}

							if (!isAuthenticated) {
								return (
									<Button
										type="primary"
										style={{ width: '100%' }}
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
		</>
	);
};
