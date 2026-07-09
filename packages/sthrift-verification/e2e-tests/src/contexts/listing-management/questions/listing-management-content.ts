import type { ElementHandle } from '@cellix/serenity-framework/pages';
import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type AnswersQuestions, Question, type UsesAbilities } from '@serenity-js/core';
import { ListingManagementPage } from '../pages/listing-management.page.ts';

async function visible(actor: AnswersQuestions & UsesAbilities, element: (page: ListingManagementPage) => ElementHandle) {
	const page = new ListingManagementPage(new PlaywrightPageAdapter(BrowseTheWeb.withActor(actor).page));
	const handle = element(page);
	await handle.waitFor({ state: 'visible', timeout: 15_000 });
	return handle.isVisible();
}

export const ListingsDashboard = Question.about('the listings dashboard', (actor) => visible(actor, (page) => page.heading));
export const IncomingRequestsTab = Question.about('the incoming requests tab', (actor) => visible(actor, (page) => page.requestsTab));
export const CreateListingForm = Question.about('the create listing form', (actor) => visible(actor, (page) => page.createListingHeading));
