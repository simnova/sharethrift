import type { ReservationPage } from '../reservation.page.ts';

export type UiReservationPage = Pick<
	ReservationPage,
	'openDatePicker' | 'clickReserve'
>;

export type E2EReservationPage = Pick<
	ReservationPage,
	| 'rangePicker'
	| 'disabledPicker'
	| 'reserveButton'
	| 'cancelRequestButton'
	| 'loadingIcon'
	| 'overlapErrorMessage'
	| 'nextMonthButton'
	| 'skeleton'
	| 'calendarCell'
	| 'isDisabled'
	| 'isCalendarCellDisabled'
	| 'openDatePicker'
>;
