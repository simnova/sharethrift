import { describe, expect, it } from 'vitest';
import {
	checkApplicationServicesFactoryPattern,
	checkApplicationServicesDependencyBoundaries,
	checkApplicationServicesIndexComposition,
	checkApplicationServicesTransactionUsage,
	checkApplicationServicesQueryPattern,
} from '../checks/application-services-conventions.js';

export interface ApplicationServicesConventionTestsConfig {
	applicationServicesGlob: string;
	applicationServicesAllGlob: string;
}

export function describeApplicationServicesConventionTests(config: ApplicationServicesConventionTestsConfig): void {
	describe('Application Services Conventions', () => {
		describe('Factory Pattern', () => {
			it('action files must follow curried factory pattern: (dataSources) => async (command) => result', async () => {
				const violations = await checkApplicationServicesFactoryPattern({
					applicationServicesGlob: config.applicationServicesGlob,
				});
				expect(violations).toStrictEqual([]);
			}, 30000);
		});

		describe('Dependency Boundaries', () => {
			it('must not import mongoose directly', async () => {
				const violations = await checkApplicationServicesDependencyBoundaries({
					applicationServicesAllGlob: config.applicationServicesAllGlob,
				});
				expect(violations.filter((v) => v.includes('mongoose directly'))).toStrictEqual([]);
			}, 30000);

			it('must not import @cellix/mongoose-seedwork', async () => {
				const violations = await checkApplicationServicesDependencyBoundaries({
					applicationServicesAllGlob: config.applicationServicesAllGlob,
				});
				expect(violations.filter((v) => v.includes('mongoose-seedwork'))).toStrictEqual([]);
			}, 30000);

			it('must not import @sthrift/data-sources-mongoose-models', async () => {
				const violations = await checkApplicationServicesDependencyBoundaries({
					applicationServicesAllGlob: config.applicationServicesAllGlob,
				});
				expect(violations.filter((v) => v.includes('data-sources-mongoose-models'))).toStrictEqual([]);
			}, 30000);

			it('must not import from @sthrift/graphql', async () => {
				const violations = await checkApplicationServicesDependencyBoundaries({
					applicationServicesAllGlob: config.applicationServicesAllGlob,
				});
				expect(violations.filter((v) => v.includes('graphql'))).toStrictEqual([]);
			}, 30000);
		});

		describe('Index Composition', () => {
			it('entity-level index files must define an ApplicationService interface', async () => {
				const violations = await checkApplicationServicesIndexComposition({
					applicationServicesGlob: config.applicationServicesGlob,
				});
				expect(violations).toStrictEqual([]);
			}, 30000);
		});

		describe('CQRS Patterns', () => {
			it('mutation actions (create/update/delete) must use withScopedTransaction', async () => {
				const violations = await checkApplicationServicesTransactionUsage({
					applicationServicesGlob: config.applicationServicesGlob,
				});
				expect(violations).toStrictEqual([]);
			}, 30000);

			it('query actions must use readonlyDataSource', async () => {
				const violations = await checkApplicationServicesQueryPattern({
					applicationServicesGlob: config.applicationServicesGlob,
				});
				expect(violations).toStrictEqual([]);
			}, 30000);
		});
	});
}
