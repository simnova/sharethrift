import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type AnswersQuestions, Question, type UsesAbilities } from '@serenity-js/core';
import { AccountSettingsPage } from '../pages/account-settings.page.ts';
export const AccountSettingsContent = Question.about('editable account settings', async (actor: AnswersQuestions & UsesAbilities) => {
	const view = new AccountSettingsPage(new PlaywrightPageAdapter(BrowseTheWeb.withActor(actor).page));
	await view.profileInformation.waitFor({ state: 'visible', timeout: 15_000 });
	return (await view.profileInformation.isVisible()) && (await view.editProfileButton.isVisible());
});

export const SavedFirstName = (value: string) =>
	Question.about(`saved first name "${value}"`, async (actor: AnswersQuestions & UsesAbilities) => {
		const view = new AccountSettingsPage(new PlaywrightPageAdapter(BrowseTheWeb.withActor(actor).page));
		const name = view.firstName(value);
		await name.waitFor({ state: 'visible', timeout: 15_000 });
		return name.isVisible();
	});
