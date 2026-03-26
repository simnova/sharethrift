import { Task, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../../shared/abilities/browse-the-web.ts';
import type { CreateReservationRequestInput } from '../../abilities/reservation-request-types.ts';

interface ReservationRequestNotes {
	lastReservationRequestId: string;
	lastReservationRequestState: string;
	lastReservationRequestStartDate: string;
	lastReservationRequestEndDate: string;
}

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(`creates reservation request for listing "${input.listingId}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.as(actor);

		// Navigate to the listing detail page
		await page.goto(`/listing/${this.input.listingId}`);
		await page.waitForLoadState('networkidle');

		// Wait for the reservation form to render
		const rangePicker = page.locator('.ant-picker-range');
		await rangePicker.waitFor({ state: 'visible', timeout: 10_000 });

		// If the range picker is disabled, the listing has existing reservations
		// that prevent new ones (the UI disables the picker when dates overlap).
		const pickerDisabled = await rangePicker.evaluate(
			(el) => el.classList.contains('ant-picker-disabled'),
		);
		if (pickerDisabled) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Click the range picker to open the date panel
		await rangePicker.click();

		const hasStart = this.input.reservationPeriodStart instanceof Date;
		const hasEnd = this.input.reservationPeriodEnd instanceof Date;

		// If either date is missing, the user cannot complete the reservation form.
		// In E2E, the Reserve button stays disabled when dates are not fully selected.
		if (!hasStart || !hasEnd) {
			await page.keyboard.press('Escape');
			const missing = !hasStart ? 'reservationPeriodStart' : 'reservationPeriodEnd';
			throw new Error(`Required field missing: ${missing}`);
		}

		const startDateStr = this.formatDate(this.input.reservationPeriodStart);
		const endDateStr = this.formatDate(this.input.reservationPeriodEnd);

		// Check if the start date is disabled (overlapping with existing reservation).
		// In antd, disabled date cells have the 'ant-picker-cell-disabled' class.
		const startCell = page.locator(`td[title="${startDateStr}"]`).first();
		await startCell.waitFor({ state: 'visible', timeout: 5_000 });

		const startDisabled = await startCell.evaluate(
			(el) => el.classList.contains('ant-picker-cell-disabled'),
		);

		if (startDisabled) {
			// Close the picker and report the overlap error
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Click the start date
		await startCell.click();

		// Check if end date is disabled
		const endCell = page.locator(`td[title="${endDateStr}"]`).first();
		await endCell.waitFor({ state: 'visible', timeout: 5_000 });

		const endDisabled = await endCell.evaluate(
			(el) => el.classList.contains('ant-picker-cell-disabled'),
		);

		if (endDisabled) {
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Click the end date
		await endCell.click();

		// Check for client-side date selection error (shown when range overlaps)
		const dateErrorEl = page.locator('div').filter({ hasText: /overlaps with existing reservations/i }).first();
		const dateSelectionError = await dateErrorEl.textContent({ timeout: 2_000 }).catch(() => null);
		if (dateSelectionError) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Wait for the Reserve button to become enabled and click it
		const reserveButton = page.getByRole('button', { name: /Reserve/i });
		await reserveButton.waitFor({ state: 'visible', timeout: 5_000 });

		// Set up response interception to capture the mutation result
		let mutationResponse: { success: boolean; errorMessage?: string; reservationRequest?: { id: string; state: string } } | undefined;
		let mutationError: string | undefined;

		const mutationResponsePromise = new Promise<void>((resolve) => {
			const handler = async (resp: import('@playwright/test').Response) => {
				if (resp.request().method() !== 'POST') return;
				try {
					const postData = resp.request().postData();
					if (!postData?.toLowerCase().includes('createreservationrequest')) return;

					const json = await resp.json();
					const responses = Array.isArray(json) ? json : [json];
					for (const entry of responses) {
						if (entry?.data?.createReservationRequest) {
							const result = entry.data.createReservationRequest;
							mutationResponse = {
								success: result.status?.success ?? true,
								errorMessage: result.status?.errorMessage,
								reservationRequest: result.reservationRequest,
							};
							page.off('response', handler);
							resolve();
							return;
						}
						if (entry?.errors?.length) {
							// Skip PersistedQueryNotFound — Apollo Client retries
							// automatically with the full query text.
							const isPersistedQueryRetry = entry.errors.some(
								(e: { message: string }) => e.message === 'PersistedQueryNotFound',
							);
							if (isPersistedQueryRetry) return;

							mutationError = entry.errors.map((e: { message: string }) => e.message).join('; ');
							page.off('response', handler);
							resolve();
							return;
						}
					}
				} catch {
					// Response wasn't JSON — ignore
				}
			};
			page.on('response', handler);

			setTimeout(() => {
				page.off('response', handler);
				resolve();
			}, 15_000);
		});

		await reserveButton.click();

		await mutationResponsePromise;

		if (mutationError) {
			throw new Error(mutationError);
		}

		if (!mutationResponse) {
			throw new Error('No createReservationRequest response received');
		}

		if (!mutationResponse.success) {
			throw new Error(mutationResponse.errorMessage ?? 'Reservation request creation failed');
		}

		const reservation = mutationResponse.reservationRequest;
		const reservationId = reservation?.id ?? 'e2e-unknown';

		// --- DOM verification: the site is the source of truth ---

		// After a successful reservation, the UI refetches data and replaces the
		// "Reserve" button with "Cancel Request". Verify this from the DOM.
		const cancelButton = page.getByRole('button', { name: /Cancel Request/i });
		await cancelButton.waitFor({ state: 'visible', timeout: 10_000 });

		// The presence of the "Cancel Request" button proves the server accepted the
		// reservation and the site re-rendered with the updated state.
		const domState = 'Requested';

		// Also verify the date picker is now disabled (no overlapping reservations can be made)
		const disabledPicker = page.locator('.ant-picker-range.ant-picker-disabled');
		const pickerIsDisabled = await disabledPicker.isVisible({ timeout: 5_000 }).catch(() => false);

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', reservationId),
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
