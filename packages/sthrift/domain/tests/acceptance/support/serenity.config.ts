import { setDefaultTimeout } from '@cucumber/cucumber';
import { Cast, configure, ArtifactArchiver } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import * as path from 'node:path';
import { CreateListingAbility } from '../screenplay/abilities/index.ts';

/**
 * Serenity.js Configuration
 * 
 * KNOWN LIMITATION: Serenity BDD enhanced HTML reports are not currently functional
 * due to a compatibility issue between @serenity-js/cucumber formatter and ESM+pnpm+tsx
 * environment. The formatter loads but does not emit events to the Serenity Stage.
 * 
 * GitHub Issue: To be created - tracking ESM compatibility investigation
 * Workaround: Using standard Cucumber JSON reports which accurately reflect test results.
 * 
 * The Screenplay Pattern architecture (Abilities, Tasks, Questions, Actors) is fully
 * functional and provides excellent test maintainability. Only the enhanced reporting
 * is affected by this limitation.
 */

const outputDir =
	process.env.SERENITY_OUTPUT_DIR ||
	path.join(process.cwd(), '../../../apps/docs/static/serenity-reports');

// Mock dependencies for testing
// TODO: Replace with actual domain dependencies when integrating with real tests
const mockUow = {} as any;
const mockUser = {} as any;
const mockPassport = {} as any;

configure({
	actors: Cast.where((actor) =>
		actor.whoCan(CreateListingAbility.using(mockUow, mockUser, mockPassport)),
	),
	crew: [
		ConsoleReporter.forDarkTerminals(),
		ArtifactArchiver.storingArtifactsAt(outputDir),
		SerenityBDDReporter.fromJSON({
			specDirectory: 'tests/acceptance/features',
		}),
	],
});

setDefaultTimeout(30000);
