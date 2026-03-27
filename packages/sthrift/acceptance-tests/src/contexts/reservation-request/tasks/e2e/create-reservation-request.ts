import { Task, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../../shared/abilities/browse-the-web.ts';
import type { CreateReservationRequestInput, ReservationRequestNotes } from '../../abilities/reservation-request-types.ts';
import { ReservationPage } from './reservation-page.ts';

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(`creates reservation request for listing "${input.listingId}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.as(actor);
		const reservationPage = new ReservationPage(page);

		await page.goto(`/listing/${this.input.listingId}`);
		await page.waitForLoadState('networkidle');

		await reservationPage.rangePicker.waitFor({ state: 'visible', timeout: 10_000 });

		if (await reservationPage.isRangePickerDisabled) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		await reservationPage.rangePicker.click();

		const hasStart = this.input.reservationPeriodStart instanceof Date;
		const hasEnd = this.input.reservationPeriodEnd instanceof Date;

		if (!hasStart || !hasEnd) {
			await page.keyboard.press('Escape');
			const missing = !hasStart ? 'reservationPeriodStart' : 'reservationPeriodEnd';
			throw new Error(`Required field missing: ${missing}`);
		}

		const startDateStr = this.formatDate(this.input.reservationPeriodStart);
		const endDateStr = this.formatDate(this.input.reservationPeriodEnd);

		const startCell = reservationPage.calendarCell(startDateStr);
		await startCell.waitFor({ state: 'visible', timeout: 5_000 });

		if (await reservationPage.isCalendarCellDisabled(startDateStr)) {
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		await startCell.click();

		const endCell = reservationPage.calendarCell(endDateStr);
		await endCell.waitFor({ state: 'visible', timeout: 5_000 });

		if (await reservationPage.isCalendarCellDisabled(endDateStr)) {
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		await endCell.click();

		const dateSelectionError = await reservationPage.overlapErrorMessage
			.textContent({ timeout: 2_000 }).catch(() => null);
		if (dateSelectionError) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Click Reserve button
		await reservationPage.reserveButton.waitFor({ state: 'visible', timeout: 5_000 });
		await reservationPage.reserveButton.click();

		// Verify button shows loading state during submission
		await reservationPage.loadingIcon.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});

		// Verify "Cancel Request" button appears (proves reservation was accepted)
		await reservationPage.cancelRequestButton.waitFor({ state: 'visible', timeout: 15_000 });

		const cancelButtonText = await reservationPage.cancelRequestButton.textContent();
		const domState = cancelButtonText?.includes('Cancel Request') ? 'Requested' : 'Unknown';

		if (domState !== 'Requested') {
			throw new Error(
				`Expected reservation button to show "Cancel Request" but got: "${cancelButtonText}"`,
			);
		}

		// Verify date picker is disabled after reservation
		await reservationPage.disabledRangePicker.waitFor({ state: 'visible', timeout: 5_000 });

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', this.input.listingId),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', domState),
			notes<ReservationRequestNotes>().set('lastReservationRequestStartDate', startDateStr),
			notes<ReservationRequestNotes>().set('lastReservationRequestEndDate', endDateStr),
		);
	}

	private formatDate(date: Date): string {
		return date.toISOString().split('T')[0] ?? '';
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (e2e)`;
}
