import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type AnswersQuestions, Question, type UsesAbilities } from '@serenity-js/core';
import { HomePage } from '../pages/home.page.ts';

function pageFor(actor: AnswersQuestions & UsesAbilities) {
	return new HomePage(new PlaywrightPageAdapter(BrowseTheWeb.withActor(actor).page));
}

export const DiscoveryControls = Question.about('the home discovery controls', async (actor: AnswersQuestions & UsesAbilities) => {
	const home = pageFor(actor);
	await home.searchInput.waitFor({ state: 'visible', timeout: 15_000 });
	return (await home.categoryFilter.isVisible()) && (await home.locationFilter.isVisible());
});

export const ListingInDiscovery = (title: string) =>
	Question.about(`listing "${title}" on the home page`, async (actor: AnswersQuestions & UsesAbilities) => {
		const listing = pageFor(actor).listing(title);
		await listing.waitFor({ state: 'visible', timeout: 15_000 });
		return listing.isVisible();
	});

export const SelectedCategory = (category: string) =>
	Question.about(`selected category "${category}"`, async (actor: AnswersQuestions & UsesAbilities) => {
		const selected = pageFor(actor).selectedCategory(category);
		await selected.waitFor({ state: 'visible', timeout: 15_000 });
		return selected.isVisible();
	});
