import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type AnswersQuestions, Question, type UsesAbilities } from '@serenity-js/core';
import { MessagesPage } from '../pages/messages.page.ts';
export const MessagingWorkspace = Question.about('the messaging workspace', async (actor: AnswersQuestions & UsesAbilities) => {
	const view = new MessagesPage(new PlaywrightPageAdapter(BrowseTheWeb.withActor(actor).page));
	await view.emptyConversationPrompt.waitFor({ state: 'visible', timeout: 15_000 });
	return view.emptyConversationPrompt.isVisible();
});

export const SentMessage = (content: string) =>
	Question.about(`sent message "${content}"`, async (actor: AnswersQuestions & UsesAbilities) => {
		const view = new MessagesPage(new PlaywrightPageAdapter(BrowseTheWeb.withActor(actor).page));
		const message = view.message(content);
		await message.waitFor({ state: 'visible', timeout: 15_000 });
		return message.isVisible();
	});
