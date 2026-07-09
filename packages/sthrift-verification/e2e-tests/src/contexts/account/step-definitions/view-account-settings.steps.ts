import { Then, When } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.ts';
import { SavedFirstName } from '../questions/account-settings-content.ts';
import { ChangeFirstName, OpenAccountSettings } from '../tasks/open-account-settings.ts';

When('{word} opens her account settings', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(OpenAccountSettings.fromNavigation());
});
When('{word} changes her first name to {string}', async function (this: ShareThriftWorld, name: string, value: string) {
	await actorCalled(name).attemptsTo(ChangeFirstName.to(value));
});
Then('{word} should see the saved first name {string}', async function (this: ShareThriftWorld, name: string, value: string) {
	await actorCalled(name).attemptsTo(Ensure.that(SavedFirstName(value), equals(true)));
});
