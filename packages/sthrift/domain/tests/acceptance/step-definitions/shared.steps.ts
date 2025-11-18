import { Given, Then } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { createTestUserRef } from '../fixtures/test-user-fixtures';

Given('a valid PersonalUserEntityReference for {string}',  (userId: string) => {
    const actor = actorCalled('User');
    actor.personalUser = createTestUserRef(userId.replace(/^"|"$/g, ''));
});

Then('a PermissionError should be thrown', () => {
    const actor = actorCalled('User');
    if (!actor.error) {
        throw new Error('Expected an error to be thrown but no error was captured');
    }
    console.log('Error in assertion:', {
        error: actor.error,
        name: actor.error.name,
        constructor: actor.error.constructor.name,
        message: actor.error.message,
        isPermissionError: actor.error instanceof DomainSeedwork.PermissionError
    });
    actor.attemptsTo(
        Ensure.that(actor.error instanceof DomainSeedwork.PermissionError, equals(true))
    );
});