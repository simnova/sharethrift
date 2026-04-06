import { Task, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';
import {
	type E2EReservationPage,
	ReservationPage,
	formatDate,
} from '@sthrift-verification/test-support/pages';
import { PlaywrightPageAdapter } from '@sthrift-verification/test-support/pages/playwright';
import type { CreateReservationRequestInput, ReservationRequestNotes } from '../types.ts';

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(`creates reservation request for listing "${input.listingId}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.withActor(actor);
		const reservationPage: E2EReservationPage = new ReservationPage(
			new PlaywrightPageAdapter(page),
		);

		await page.goto(`/listing/${this.input.listingId}`, { waitUntil: 'domcontentloaded' });

		// Wait for all GraphQL queries to resolve (skeleton disappears)
		await reservationPage.skeleton.waitFor({ state: 'hidden', timeout: 15_000 });

		await reservationPage.rangePicker.waitFor({ state: 'visible', timeout: 10_000 });

		if (await reservationPage.isDisabled()) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		const hasStart = this.input.reservationPeriodStart instanceof Date;
		const hasEnd = this.input.reservationPeriodEnd instanceof Date;

		if (!hasStart || !hasEnd) {
			await page.keyboard.press('Escape');
			const missing = !hasStart ? 'reservationPeriodStart' : 'reservationPeriodEnd';
			throw new Error(`Required field missing: ${missing}`);
		}

		await reservationPage.openDatePicker();

		const startDateStr = formatDate(this.input.reservationPeriodStart);
		const endDateStr = formatDate(this.input.reservationPeriodEnd);

		const startCell = reservationPage.calendarCell(startDateStr);
		await startCell.waitFor({ state: 'visible', timeout: 5_000 });

		if (await reservationPage.isCalendarCellDisabled(startDateStr)) {
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		await startCell.click();

		let endCell = reservationPage.calendarCell(endDateStr);
		try {
			await endCell.waitFor({ state: 'visible', timeout: 1_000 });
		} catch {
			await reservationPage.nextMonthButton.click();
			endCell = reservationPage.calendarCell(endDateStr);
		}

		await endCell.waitFor({ state: 'visible', timeout: 5_000 });

		if (await reservationPage.isCalendarCellDisabled(endDateStr)) {
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		await endCell.click();

		const dateSelectionError = await reservationPage.overlapErrorMessage
			.waitFor({ state: 'visible', timeout: 500 })
			.then(() => reservationPage.overlapErrorMessage.textContent())
			.catch(() => null);
		if (dateSelectionError) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Click Reserve button
		await reservationPage.reserveButton.waitFor({ state: 'visible', timeout: 5_000 });
		await reservationPage.reserveButton.click();

		// Verify button shows loading state during submission
		await reservationPage.loadingIcon.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {
			// Loading icon may not appear if submission is very fast
		});

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
		await reservationPage.disabledPicker.waitFor({ state: 'visible', timeout: 5_000 });

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', this.input.listingId),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', domState),
			notes<ReservationRequestNotes>().set('lastReservationRequestStartDate', startDateStr),
			notes<ReservationRequestNotes>().set('lastReservationRequestEndDate', endDateStr),
		);
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (e2e)`;
}
