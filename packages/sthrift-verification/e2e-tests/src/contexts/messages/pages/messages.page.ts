import type { PageAdapter } from '@cellix/serenity-framework/pages';
export class MessagesPage {
	constructor(private readonly adapter: PageAdapter) {}
	get emptyConversationPrompt() {
		return this.adapter.getByText('Select a conversation to start messaging.');
	}
	get messageInput() {
		return this.adapter.getByPlaceholder('Type a message...');
	}
	get sendButton() {
		return this.adapter.getByRole('button', { name: 'Send' });
	}
	message(content: string) {
		return this.adapter.getByText(content);
	}
	conversationFor(listingTitle: string) {
		return this.adapter.getByText(`Listing: ${listingTitle}`);
	}
	async send(content: string): Promise<void> {
		await this.messageInput.waitFor({ state: 'visible', timeout: 15_000 });
		await this.messageInput.fill(content);
		await this.sendButton.click();
		// The send mutation persists on the server and only renders the message once
		// the server responds (the resolver uses `update`, not an optimistic response).
		// Wait for the message to appear before returning so a subsequent navigation
		// cannot abort the in-flight mutation before it reaches the backend.
		await this.message(content).waitFor({ state: 'visible', timeout: 15_000 });
	}
	async selectConversation(listingTitle: string): Promise<void> {
		const conversation = this.conversationFor(listingTitle);
		await conversation.waitFor({ state: 'visible', timeout: 15_000 });
		await conversation.click();
		await this.messageInput.waitFor({ state: 'visible', timeout: 15_000 });
	}
}
