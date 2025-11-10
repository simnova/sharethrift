import { actorCalled } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';

/**
 * Creates an actor that can interact with the ShareThrift API.
 * actors: represent the users or systems that perform actions.
 */

export const ActorNamed = (name: string) =>
  actorCalled(name).whoCan(
    CallAnApi.at('http://localhost:3000/api')
  );
