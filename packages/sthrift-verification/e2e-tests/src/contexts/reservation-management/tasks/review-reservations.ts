import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, Task } from '@serenity-js/core';
import { NavigationPage } from '../../../shared/pages/navigation.page.ts';
import { ReservationsPage } from '../pages/reservations.page.ts';
export class OpenReservations extends Task {
	static fromNavigation() {
		return new OpenReservations();
	}
	private constructor() {
		super('opens My Reservations');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new NavigationPage(new PlaywrightPageAdapter(page)).open('My Reservations');
	}
}
export class ViewReservationHistory extends Task {
	static fromActiveReservations() {
		return new ViewReservationHistory();
	}
	private constructor() {
		super('views reservation history');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new ReservationsPage(new PlaywrightPageAdapter(page)).viewHistory();
	}
}
