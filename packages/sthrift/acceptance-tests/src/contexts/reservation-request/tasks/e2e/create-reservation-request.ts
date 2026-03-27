import { Task, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../../shared/abilities/browse-the-web.ts';
import type { CreateReservationRequestInput, ReservationRequestNotes } from '../../abilities/reservation-request-types.ts';

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(`creates reservation request for listing "${input.listingId}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.as(actor);

		// Navigate and load listing page
		await page.goto(`/listing/${this.input.listingId}`);
		await page.waitForLoadState('networkidle');

		const rangePicker = page.locator('.ant-picker-range');
		await rangePicker.waitFor({ state: 'visible', timeout: 10_000 });

		// Disabled picker means existing overlapping reservations
		const pickerDisabled = await rangePicker.evaluate(
			(el) => el.classList.contains('ant-picker-disabled'),
		);
		if (pickerDisabled) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		await rangePicker.click();

		const hasStart = this.input.reservationPeriodStart instanceof Date;
		const hasEnd = this.input.reservationPeriodEnd instanceof Date;

		// Both dates required
		if (!hasStart || !hasEnd) {
			await page.keyboard.press('Escape');
			const missing = !hasStart ? 'reservationPeriodStart' : 'reservationPeriodEnd';
			throw new Error(`Required field missing: ${missing}`);
		}

		const startDateStr = this.formatDate(this.input.reservationPeriodStart);
		const endDateStr = this.formatDate(this.input.reservationPeriodEnd);

		// Check if start date is disabled (antd: ant-picker-cell-disabled)
		const startCell = page.locator(`td[title="${startDateStr}"]`).first();
		await startCell.waitFor({ state: 'visible', timeout: 5_000 });

		const startDisabled = await startCell.evaluate(
			(el) => el.classList.contains('ant-picker-cell-disabled'),
		);

		if (startDisabled) {
			await page.keyboard.press('Escape');
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

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

		await endCell.click();

		// Check for client-side overlap error
		const dateErrorEl = page.locator('div').filter({ hasText: /overlaps with existing reservations/i }).first();
		const dateSelectionError = await dateErrorEl.textContent({ timeout: 2_000 }).catch(() => null);
		if (dateSelectionError) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Click Reserve button
		const reserveButton = page.getByRole('button', { name: /Reserve/i });
		await reserveButton.waitFor({ state: 'visible', timeout: 5_000 });

		// Intercept mutation response
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
							// Skip PersistedQueryNotFound (Apollo retries with full query)
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
					// Ignore non-JSON responses
				}
			};
			page.on('response', handler);

			// 15s timeout
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

		// Verify Cancel Request button appears (proves reservation accepted)
		const cancelButton = page.getByRole('button', { name: /Cancel Request/i });
		await cancelButton.waitFor({ state: 'visible', timeout: 10_000 });
		const domState = 'Requested';

		// Verify date picker is disabled
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
