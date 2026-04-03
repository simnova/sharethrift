import { Question, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';
import { ListingPage } from '@sthrift-verification/test-support/pages';
import { PlaywrightPageAdapter } from '@sthrift-verification/test-support/pages/playwright';

export class ListingStatus extends Question<Promise<string>> {
	constructor() {
		super('listing status');
	}

	override answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		return this.resolveStatus(actor);
	}

	static of(): ListingStatus {
		return new ListingStatus();
	}

	override toString(): string {
		return 'the listing status';
	}

	private async resolveStatus(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		const listingTitle = await this.readNote(actor, 'lastListingTitle');

		const pageStatus = await this.readStatusFromPage(actor, listingTitle);
		if (pageStatus) {
			return this.normalizeStatus(pageStatus);
		}

		const notedStatus = await this.readNote(actor, 'lastListingStatus');
		if (!notedStatus) {
			throw new Error(
				'No listing status found in the system or actor notes. Did the actor create a listing first?',
			);
		}

		return this.normalizeStatus(notedStatus);
	}

	private async readStatusFromPage(actor: AnswersQuestions & UsesAbilities, listingTitle?: string): Promise<string | undefined> {
		if (!listingTitle) {
			return undefined;
		}

		try {
			const { page } = BrowseTheWeb.withActor(actor);
			const listingPage = new ListingPage(new PlaywrightPageAdapter(page));
			const statusTag = await listingPage.statusTagInRow(listingTitle);
			if (!statusTag) {
				return undefined;
			}
			await statusTag.waitFor({ state: 'visible', timeout: 3_000 });
			return (await statusTag.textContent())?.trim() || undefined;
		} catch {
			return undefined;
		}
	}

	private async readNote(actor: AnswersQuestions & UsesAbilities, key: 'lastListingId' | 'lastListingTitle' | 'lastListingStatus'): Promise<string | undefined> {
		try {
			return await actor.answer(notes<Record<typeof key, string>>().get(key));
		} catch {
			return undefined;
		}
	}

	private normalizeStatus(status: string): string {
		const normalized = status.trim().toLowerCase();
		if (normalized === 'published') {
			return 'active';
		}
		return normalized;
	}
}
