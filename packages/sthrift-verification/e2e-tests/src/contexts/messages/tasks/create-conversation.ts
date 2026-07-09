import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, notes, Task } from '@serenity-js/core';

export interface ConversationNotes {
	conversationListingTitle: string;
}

export class CreateConversation extends Task {
	static about(listingTitle: string) {
		return new CreateConversation(listingTitle);
	}
	private constructor(private readonly listingTitle: string) {
		super(`has a conversation about "${listingTitle}"`);
	}
	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.withActor(actor);
		const token = await page.evaluate(() => {
			for (const storage of [sessionStorage, localStorage]) {
				for (let index = 0; index < storage.length; index += 1) {
					const raw = storage.getItem(storage.key(index) ?? '');
					if (!raw) continue;
					try {
						const user = JSON.parse(raw) as { access_token?: string; id_token?: string };
						if (user.access_token || user.id_token) return user.access_token ?? user.id_token;
					} catch {
						/* unrelated storage entry */
					}
				}
			}
			return undefined;
		});
		if (!token) throw new Error('Authenticated browser session did not contain an OAuth token');

		const query = `query CurrentUserForConversation { currentUser { ... on PersonalUser { id } } }`;
		const currentUserResponse = await page.request.post('https://data-access.sharethrift.localhost:1355/api/graphql', {
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			data: { query },
		});
		const currentUserJson = (await currentUserResponse.json()) as { data?: { currentUser?: { id?: string } } };
		const userId = currentUserJson.data?.currentUser?.id;
		if (!userId) throw new Error(`Could not resolve current user for conversation: ${JSON.stringify(currentUserJson)}`);

		const start = new Date();
		start.setDate(start.getDate() + 1);
		const end = new Date();
		end.setDate(end.getDate() + 30);
		const createListing = `mutation CreateMessagingFixtureListing($input: ItemListingCreateInput!) { createItemListing(input: $input) { status { success errorMessage } listing { id } } }`;
		const listingResponse = await page.request.post('https://data-access.sharethrift.localhost:1355/api/graphql', {
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			data: {
				query: createListing,
				variables: {
					input: {
						title: this.listingTitle,
						description: 'Messaging scenario fixture',
						category: 'Other',
						location: 'Philadelphia, PA',
						sharingPeriodStart: start.toISOString(),
						sharingPeriodEnd: end.toISOString(),
						isDraft: true,
					},
				},
			},
		});
		const listingJson = (await listingResponse.json()) as { data?: { createItemListing?: { status?: { success?: boolean; errorMessage?: string }; listing?: { id?: string } } } };
		const listingId = listingJson.data?.createItemListing?.listing?.id;
		if (!listingJson.data?.createItemListing?.status?.success || !listingId) {
			throw new Error(`Listing fixture setup failed: ${listingJson.data?.createItemListing?.status?.errorMessage ?? JSON.stringify(listingJson)}`);
		}

		const mutation = `mutation CreateE2EConversation($input: ConversationCreateInput!) { createConversation(input: $input) { status { success errorMessage } conversation { id } } }`;
		const response = await page.request.post('https://data-access.sharethrift.localhost:1355/api/graphql', {
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			data: { query: mutation, variables: { input: { listingId, sharerId: userId, reserverId: userId } } },
		});
		const json = (await response.json()) as { data?: { createConversation?: { status?: { success?: boolean; errorMessage?: string } } } };
		if (!json.data?.createConversation?.status?.success) {
			throw new Error(`Conversation setup failed: ${json.data?.createConversation?.status?.errorMessage ?? JSON.stringify(json)}`);
		}
		await actor.attemptsTo(notes<ConversationNotes>().set('conversationListingTitle', this.listingTitle));
	}
}
