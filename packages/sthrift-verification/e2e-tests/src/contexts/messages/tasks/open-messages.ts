import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, notes, Task } from '@serenity-js/core';
import { NavigationPage } from '../../../shared/pages/navigation.page.ts';
import { MessagesPage } from '../pages/messages.page.ts';
import type { ConversationNotes } from './create-conversation.ts';
export class OpenMessages extends Task {
	static fromNavigation() {
		return new OpenMessages();
	}
	static afterVisitingHome() {
		return Task.where('#actor leaves and reopens Messages', new NavigateHome(), new OpenMessages());
	}
	private constructor() {
		super('opens Messages from the navigation');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new NavigationPage(new PlaywrightPageAdapter(page)).open('Messages');
		const listingTitle = await actor.answer(notes<ConversationNotes>().get('conversationListingTitle'));
		await new MessagesPage(new PlaywrightPageAdapter(page)).selectConversation(listingTitle);
	}
}

class NavigateHome extends Task {
	constructor() {
		super('navigates home');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new NavigationPage(new PlaywrightPageAdapter(page)).open('Home');
	}
}

export class SendMessage extends Task {
	static containing(content: string) {
		return new SendMessage(content);
	}
	private constructor(private readonly content: string) {
		super(`sends the message "${content}"`);
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new MessagesPage(new PlaywrightPageAdapter(page)).send(this.content);
	}
}
