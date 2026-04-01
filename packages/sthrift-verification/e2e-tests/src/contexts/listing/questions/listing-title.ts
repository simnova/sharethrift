import { Question, type Actor, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';
import { getSession } from '../../../shared/abilities/session.ts';
import { ListingPage } from '../../../shared/pages/listing.page.ts';

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
		const listingId = await this.readNote(actor, 'lastListingId');

		const pageTitle = await this.readTitleFromPage(actor, notedTitle);
		if (pageTitle) {
			return pageTitle;
		}

		const sessionTitle = await this.readTitleFromSession(actor, listingId);
		if (sessionTitle) {
			return sessionTitle;
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
			const listingPage = new ListingPage(page);
			const titleCell = listingPage.listingTitleCell(listingTitle);
			await titleCell.waitFor({ state: 'visible', timeout: 3_000 });
			return (await titleCell.textContent())?.trim() || undefined;
		} catch {
			return undefined;
		}
	}

	private async readTitleFromSession(actor: AnswersQuestions & UsesAbilities, listingId?: string): Promise<string | undefined> {
		if (!listingId) {
			return undefined;
		}

		try {
			const session = getSession(actor as unknown as Actor, 'listing');
			const listing = await session.execute<{ id: string }, { title?: string } | null>('listing:getById', { id: listingId });
			return listing?.title ? String(listing.title) : undefined;
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
