import { Task, type PerformsActivities } from '@serenity-js/core';
import { CreateListingAbility } from '../abilities/index.ts';

/**
 * Task for creating a draft listing
 */
export const CreateDraftListing = {
	with: (params: { title: string; description: string; category: string; location: string }) =>
		Task.where(
			`#actor creates a draft listing titled "${params.title}"`,
			async (actor: PerformsActivities) => {
				const ability = CreateListingAbility.as(actor);
				await ability.createDraftListing(params);
			},
		),
};
