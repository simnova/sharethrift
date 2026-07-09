import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.ts';
import { SentMessage } from '../questions/messaging-workspace.ts';
import { CreateConversation } from '../tasks/create-conversation.ts';
import { OpenMessages, SendMessage } from '../tasks/open-messages.ts';

Given('{word} has a conversation about {string}', async function (this: ShareThriftWorld, name: string, title: string) {
	await actorCalled(name).attemptsTo(CreateConversation.about(title));
});

When('{word} opens her messages', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(OpenMessages.fromNavigation());
});
When('{word} sends the message {string}', async function (this: ShareThriftWorld, name: string, content: string) {
	await actorCalled(name).attemptsTo(SendMessage.containing(content));
});
When('{word} leaves and reopens her messages', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(OpenMessages.afterVisitingHome());
});
Then('{word} should see the sent message {string}', async function (this: ShareThriftWorld, name: string, content: string) {
	await actorCalled(name).attemptsTo(Ensure.that(SentMessage(content), equals(true)));
});
