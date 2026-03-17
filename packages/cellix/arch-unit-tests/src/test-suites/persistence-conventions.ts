import { describe, expect, it } from 'vitest';
import {
	checkPersistenceRepositoryConventions,
	checkPersistenceDomainAdapterConventions,
	checkPersistenceUnitOfWorkConventions,
	checkPersistenceReadonlyDataConventions,
	checkPersistenceDependencyBoundaries,
	checkPersistenceAbstractionDependencies,
} from '../checks/persistence-conventions.js';

export interface PersistenceConventionTestsConfig {
	persistenceDomainGlob: string;
	persistenceReadonlyGlob: string;
	persistenceAllGlob: string;
}

export function describePersistenceConventionTests(config: PersistenceConventionTestsConfig): void {
	describe('Persistence Layer Conventions', () => {
		describe('Domain Repository Files', () => {
			it('repository classes must extend MongooseSeedwork.MongoRepositoryBase', async () => {
				const violations = await checkPersistenceRepositoryConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('MongoRepositoryBase'))).toStrictEqual([]);
			}, 30000);

			it('repository classes must implement domain repository interfaces', async () => {
				const violations = await checkPersistenceRepositoryConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('Domain.Contexts'))).toStrictEqual([]);
			}, 30000);
		});

		describe('Domain Adapter Files', () => {
			it('domain adapters must extend MongooseSeedwork.MongooseDomainAdapter', async () => {
				const violations = await checkPersistenceDomainAdapterConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('MongooseDomainAdapter'))).toStrictEqual([]);
			}, 30000);

			it('domain adapter files must contain a MongoTypeConverter', async () => {
				const violations = await checkPersistenceDomainAdapterConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('MongoTypeConverter'))).toStrictEqual([]);
			}, 30000);
		});

		describe('Unit of Work Files', () => {
			it('UoW files must use MongooseSeedwork.MongoUnitOfWork', async () => {
				const violations = await checkPersistenceUnitOfWorkConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('MongoUnitOfWork'))).toStrictEqual([]);
			}, 30000);

			it('UoW files must wire both InProcEventBusInstance and NodeEventBusInstance', async () => {
				const violations = await checkPersistenceUnitOfWorkConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('EventBus'))).toStrictEqual([]);
			}, 30000);

			it('UoW files must export a factory function named get*UnitOfWork', async () => {
				const violations = await checkPersistenceUnitOfWorkConventions({
					persistenceDomainGlob: config.persistenceDomainGlob,
				});
				expect(violations.filter((v) => v.includes('factory'))).toStrictEqual([]);
			}, 30000);
		});

		describe('Readonly Data Source Files', () => {
			it('readonly data source files must extend MongoDataSourceImpl', async () => {
				const violations = await checkPersistenceReadonlyDataConventions({
					persistenceReadonlyGlob: config.persistenceReadonlyGlob,
				});
				expect(violations).toStrictEqual([]);
			}, 30000);
		});

		describe('Dependency Boundaries', () => {
			it('persistence must not import from @sthrift/application-services', async () => {
				const violations = await checkPersistenceDependencyBoundaries({
					persistenceAllGlob: config.persistenceAllGlob,
				});
				expect(violations.filter((v) => v.includes('application-services'))).toStrictEqual([]);
			}, 30000);

			it('persistence must not import from @sthrift/graphql', async () => {
				const violations = await checkPersistenceDependencyBoundaries({
					persistenceAllGlob: config.persistenceAllGlob,
				});
				expect(violations.filter((v) => v.includes('graphql'))).toStrictEqual([]);
			}, 30000);
		});

		describe('Abstraction Dependencies', () => {
			it('messaging persistence must depend on @cellix/service-messaging-base, not concrete implementations', async () => {
				const violations = await checkPersistenceAbstractionDependencies({
					persistenceAllGlob: config.persistenceAllGlob,
				});
				expect(violations.filter((v) => v.includes('messaging'))).toStrictEqual([]);
			}, 30000);

			it('payment persistence must depend on @cellix/service-payment-base, not concrete implementations', async () => {
				const violations = await checkPersistenceAbstractionDependencies({
					persistenceAllGlob: config.persistenceAllGlob,
				});
				expect(violations.filter((v) => v.includes('payment'))).toStrictEqual([]);
			}, 30000);
		});
	});
}
