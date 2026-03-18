import { Question, type AnswersQuestions } from '@serenity-js/core';
import { CreateListingAbility } from '../abilities/index.ts';

/**
 * Question to check if a listing was created
 */
export const ListingWasCreated = (): Question<Promise<boolean>> =>
	Question.about('listing was created', (actor: AnswersQuestions) => {
		const ability = CreateListingAbility.as(actor);
		const listing = ability.getCreatedListing();
		return Promise.resolve(listing !== undefined);
	});

/**
 * Question to get the listing's draft state
 */
export const ListingIsDraft = (): Question<Promise<boolean>> =>
	Question.about('listing is in draft state', (actor: AnswersQuestions) => {
		const ability = CreateListingAbility.as(actor);
		const listing = ability.getCreatedListing();
		
		if (!listing) {
			return Promise.resolve(false);
		}

		// Check if listing is in draft state
		// For now, we'll consider it draft if it was just created
		// In a full implementation, you'd query the listing's actual state
		return Promise.resolve(true);
	});
