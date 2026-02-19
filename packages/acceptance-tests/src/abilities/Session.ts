import { Ability, type Actor } from '@serenity-js/core';

/**
 * Session interface - represents a user's interactive session with the ShareThrift system.
 *
 * Following Screenplay.js design recommendations:
 * "A Session represents a user (actor) having an interactive session with your system.
 *  A Session will typically be used in two places of your code:
 *  - From your session tasks
 *  - From your UI code (React/Vue components etc)"
 *
 * This interface abstracts away the implementation details (HTTP vs Domain).
 * The UI production code uses HttpSession, tests can use either.
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export interface Session {
	/**
	 * Create a new item listing
	 */
	createItemListing(input: CreateItemListingInput): Promise<ItemListing>;

	/**
	 * Query listing by ID
	 */
	getListingById(id: string): Promise<ItemListing | null>;
}

/**
 * Input for creating an item listing
 */
export interface CreateItemListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
	isDraft?: boolean;
}

/**
 * Item listing data structure
 */
export interface ItemListing {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	state: 'draft' | 'published' | 'archived';
	sharingPeriodStart?: Date;
	sharingPeriodEnd?: Date;
	images?: string[];
}

/**
 * Helper to get Session ability from an actor
 */
export function getSession(actor: Actor): Session {
	// Try to get any Session implementation
	const abilities = (actor as any).abilities as Map<any, any>;
	for (const ability of abilities.values()) {
		if ('createItemListing' in ability && 'getListingById' in ability) {
			return ability as Session;
		}
	}
	throw new Error('Actor does not have a Session ability');
}
