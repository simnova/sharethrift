import { registerManagedSerenityWorld } from '@cellix/serenity-framework/cucumber';
import type { ApiInfrastructureState } from '@cellix/serenity-framework/infrastructure/api';
import { SerenityCast } from '@cellix/serenity-framework/serenity';
import { registerLifecycleHooks } from './cucumber-lifecycle-hooks.ts';
import { infrastructure } from './infrastructure.ts';
import { GraphQLClient } from './shared/abilities/graphql-client.ts';

export const ShareThriftApiWorld = registerManagedSerenityWorld({
	infrastructure,
	validateState: (state) => {
		if (!graphqlUrl(state)) throw new Error('API acceptance infrastructure did not expose a GraphQL URL');
	},
	createCast: (state) =>
		new SerenityCast({
			useNotepad: true,
			abilities: [() => GraphQLClient.at(graphqlUrl(state))],
		}),
});

export type ShareThriftApiWorld = InstanceType<typeof ShareThriftApiWorld>;
export { ShareThriftApiWorld as ShareThriftWorld };
registerLifecycleHooks();

function graphqlUrl(state: ApiInfrastructureState): string {
	const server = state.servers['graphql'];
	return server?.isRunning() ? server.getUrl() : '';
}
