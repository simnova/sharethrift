import { Question, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';
import { ListingPage } from '@sthrift-verification/test-support/pages';
import { PlaywrightPageAdapter } from '@sthrift-verification/test-support/pages/playwright';

export class ListingTitle extends Question<Promise<string>> {
	constructor() {
		super('listing title');
	}

	static displayed(): ListingTitle {
		return new ListingTitle();
	}

	override answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		return this.resolveTitle(actor);
	}

	override toString = () => 'listing title';

	private async resolveTitle(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		const notedTitle = await this.readNote(actor, 'lastListingTitle');

		const pageTitle = await this.readTitleFromPage(actor, notedTitle);
		if (pageTitle) {
			return pageTitle;
		}

		if (!notedTitle) {
			throw new Error(
				'No listing title found in the system or actor notes. Did the actor create a listing first?',
			);
		}

		return notedTitle;
	}

	private async readTitleFromPage(actor: AnswersQuestions & UsesAbilities, listingTitle?: string): Promise<string | undefined> {
		if (!listingTitle) {
			return undefined;
		}

		try {
			const { page } = BrowseTheWeb.withActor(actor);
			const listingPage = new ListingPage(new PlaywrightPageAdapter(page));
			const titleCell = listingPage.listingTitleCell(listingTitle);
			await titleCell.waitFor({ state: 'visible', timeout: 3_000 });
			return (await titleCell.textContent())?.trim() || undefined;
		} catch {
			return undefined;
		}
	}

	private async readNote(actor: AnswersQuestions & UsesAbilities, key: 'lastListingId' | 'lastListingTitle'): Promise<string | undefined> {
		try {
			return await actor.answer(notes<Record<typeof key, string>>().get(key));
		} catch {
			return undefined;
		}
	}
}
