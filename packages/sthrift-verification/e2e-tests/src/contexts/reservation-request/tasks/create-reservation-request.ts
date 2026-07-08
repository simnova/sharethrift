import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, notes, Task } from '@serenity-js/core';
import { type E2EReservationPage, formatDate, ReservationPage } from '@sthrift-verification/verification-shared/pages';
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
		const reservationPage: E2EReservationPage = new ReservationPage(new PlaywrightPageAdapter(page));

		await this.openListingWithReservationForm(page, reservationPage);

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
		await reservationPage.reserveButton.waitFor({
			state: 'visible',
			timeout: 5_000,
		});
		await reservationPage.reserveButton.click();

		// Verify button shows loading state during submission
		await reservationPage.loadingIcon.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {
			// Loading icon may not appear if submission is very fast
		});

		// Verify "Cancel Request" button appears (proves reservation was accepted)
		await reservationPage.cancelRequestButton.waitFor({
			state: 'visible',
			timeout: 15_000,
		});

		const cancelButtonText = await reservationPage.cancelRequestButton.textContent();
		const domState = cancelButtonText?.includes('Cancel Request') ? 'Requested' : 'Unknown';

		if (domState !== 'Requested') {
			throw new Error(`Expected reservation button to show "Cancel Request" but got: "${cancelButtonText}"`);
		}

		// Verify date picker is disabled after reservation
		await reservationPage.disabledPicker.waitFor({
			state: 'visible',
			timeout: 5_000,
		});

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', this.input.listingId),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', domState),
			notes<ReservationRequestNotes>().set('lastReservationRequestStartDate', startDateStr),
			notes<ReservationRequestNotes>().set('lastReservationRequestEndDate', endDateStr),
		);
	}

	/**
	 * Navigate to the listing and wait for its reservation form to render.
	 *
	 * The e2e UI is served by the Vite dev server behind an HTTP/2 proxy, which
	 * occasionally drops one of the unbundled ES-module requests
	 * (`ERR_HTTP2_PROTOCOL_ERROR`). When that happens the SPA never bootstraps,
	 * leaving an empty `#root` with no skeleton — so waiting for the skeleton to
	 * hide would pass falsely and the later date-picker wait would time out.
	 * Waiting for the range picker to positively appear, and reloading when the
	 * app fails to boot, makes the step resilient to that transient failure.
	 */
	private async openListingWithReservationForm(page: BrowseTheWeb['page'], reservationPage: E2EReservationPage): Promise<void> {
		const maxAttempts = 3;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			await page.goto(`/listing/${this.input.listingId}`, {
				waitUntil: 'domcontentloaded',
			});

			const rendered = await reservationPage.rangePicker
				.waitFor({ state: 'visible', timeout: 12_000 })
				.then(() => true)
				.catch(() => false);
			if (rendered) {
				return;
			}

			// App failed to bootstrap (empty #root). The next iteration re-navigates
			// to the same URL, re-requesting the modules that failed to load.
		}

		throw new Error(`Reservation form did not render for listing "${this.input.listingId}" ` + `after ${maxAttempts} attempts. Current URL: ${page.url()}`);
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (e2e)`;
}
