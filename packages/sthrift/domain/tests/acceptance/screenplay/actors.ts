import { actorCalled } from '@serenity-js/core';

/**
 * Creates an actor that can interact with the ShareThrift API.
 * actors: represent the users or systems that perform actions.
 */

export const ActorNamed = (name: string) =>
  actorCalled(name);
