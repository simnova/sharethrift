import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { Then, When } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.ts';
import { ReservationsPage } from '../pages/reservations.page.ts';
import { OpenReservations, ViewReservationHistory } from '../tasks/review-reservations.ts';

When('{word} opens her reservations', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(OpenReservations.fromNavigation());
});
When('{word} views reservation history', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(ViewReservationHistory.fromActiveReservations());
});
Then('{word} should see active reservations', async function (this: ShareThriftWorld, name: string) {
	const { page } = BrowseTheWeb.withActor(actorCalled(name));
	const view = new ReservationsPage(new PlaywrightPageAdapter(page));
	await view.activeTab.waitFor({ state: 'visible', timeout: 15_000 });
});
Then('{word} should see reservation history', async function (this: ShareThriftWorld, name: string) {
	const { page } = BrowseTheWeb.withActor(actorCalled(name));
	const view = new ReservationsPage(new PlaywrightPageAdapter(page));
	await view.historyTab.waitFor({ state: 'visible', timeout: 15_000 });
});
