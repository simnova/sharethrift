import { configure } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import * as path from 'node:path';

/**
 * Serenity/JS configuration for acceptance tests.
 * Sets up reporters and output directories.
 */
export function configureSerenity() {
	configure({
		crew: [
			ConsoleReporter.withDefaultColourSupport(),
			new SerenityBDDReporter({
				outputDirectory: path.join(process.cwd(), 'target', 'site', 'serenity'),
			}),
		],
	});
}
