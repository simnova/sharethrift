import { actorCalled } from '@serenity-js/core';

/**
 * Helper to get test actor
 */
export function getTestActor() {
	return actorCalled('TestUser');
}
