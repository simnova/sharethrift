import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import type { IWorld } from '@cucumber/cucumber';
import { ShareThriftWorld } from './world.js';

/**
 * Serenity/Screenplay pattern hooks.
 * 
 * Following Aslak Hellesøy's principles:
 * - Hooks should be minimal and focus on test infrastructure
 * - External dependencies (UI server, backend) should be managed outside tests
 * - Each test level should be independent and fast to set up
 */

// Reasonable timeout for browser interactions
setDefaultTimeout(30_000);

/**
 * Initialize world and browser for DOM tests.
 *
 * Following Aslak Hellesøy's pattern:
 * - domain: No initialization needed (pure logic)
 * - graphql: No initialization needed (mocked responses)
 * - dom: Launch browser for real UI testing
 */
Before(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;
	await world.init();
});

/**
 * Clean up after each scenario.
 *
 * Closes browser if DOM tests were run.
 */
After(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;
	await world.cleanup();
});
