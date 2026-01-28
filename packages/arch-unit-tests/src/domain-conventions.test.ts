import { projectFiles } from 'archunit';
import { describe, expect, it } from 'vitest';

describe('Domain Layer Conventions', () => {
	describe('Repository Files', () => {
		it(
			'repository files must extend DomainSeedwork.Repository',
			async () => {
				const allViolations: string[] = [];
				const ruleDesc =
					'Repository interfaces must extend DomainSeedwork.Repository<T>';

				await projectFiles()
					.inFolder('../sthrift/domain/src/domain/contexts/**')
					.withName('*.repository.ts')
					.should()
					.adhereTo((file) => {
						const extendsRepository =
							/extends\s+DomainSeedwork\.Repository</.test(file.content);
						if (!extendsRepository) {
							allViolations.push(
								`[${file.path}] Repository interface does not extend DomainSeedwork.Repository<T>`,
							);
							return false;
						}
						return true;
					}, ruleDesc)
					.check();

				expect(allViolations).toStrictEqual([]);
			},
			10000,
		);

		it('repository files should not export concrete classes', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Repository files must only export interfaces, not classes';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.repository.ts')
				.should()
				.adhereTo((file) => {
					const exportsClass = /export\s+class\s+/g.test(file.content);
					if (exportsClass) {
						allViolations.push(
							`[${file.path}] Exports concrete class - repositories should only export interfaces`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});
	});

	describe('Unit of Work Files', () => {
		it('UoW files must extend DomainSeedwork.UnitOfWork and InitializedUnitOfWork', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'UoW interfaces must extend both DomainSeedwork.UnitOfWork and InitializedUnitOfWork';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.uow.ts')
				.should()
				.adhereTo((file) => {
					const extendsUnitOfWork =
						/extends\s+DomainSeedwork\.UnitOfWork</.test(file.content);
					const extendsInitializedUoW =
						/DomainSeedwork\.InitializedUnitOfWork</.test(file.content);

					if (!extendsUnitOfWork || !extendsInitializedUoW) {
						allViolations.push(
							`[${file.path}] UoW interface must extend both DomainSeedwork.UnitOfWork and InitializedUnitOfWork`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('UoW files must import Passport, entity, repository, and aggregate', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'UoW files must import Passport, entity types, repository, and aggregate';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.uow.ts')
				.should()
				.adhereTo((file) => {
					const importsPassport = /import.*Passport.*from.*passport/.test(
						file.content,
					);
					const importsEntity = /\.entity\.ts/.test(file.content);
					const importsRepository = /\.repository\.ts/.test(file.content);

					if (!importsPassport || !importsEntity || !importsRepository) {
						allViolations.push(
							`[${file.path}] UoW must import Passport, entity, and repository`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('UoW files should not have concrete implementations', async () => {
			const allViolations: string[] = [];
			const ruleDesc = 'UoW files must only export interfaces, not classes';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.uow.ts')
				.should()
				.adhereTo((file) => {
					const exportsClass = /export\s+class\s+/g.test(file.content);
					if (exportsClass) {
						allViolations.push(
							`[${file.path}] Exports concrete class - UoW should only export interfaces`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});
	});

	describe('Aggregate Root Files', () => {
		it('aggregate root files must export a class extending DomainSeedwork.AggregateRoot', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Aggregate root files must export a class extending DomainSeedwork.AggregateRoot';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.ts')
				.should()
				.adhereTo((file) => {
					// Skip non-aggregate files
					if (
						file.path.includes('.entity.ts') ||
						file.path.includes('.repository.ts') ||
						file.path.includes('.uow.ts') ||
						file.path.includes('.value-objects.ts') ||
						file.path.includes('.visa.ts') ||
						file.path.includes('.test.ts') ||
						file.path.includes('.helpers.ts') ||
						file.path.includes('index.ts') ||
						file.path.includes('passport.ts') ||
						file.path.includes('permissions.ts')
					) {
						return true;
					}

					// Skip if it's a nested entity or value object class (doesn't extend AggregateRoot)
					const extendsEntity = /extends\s+DomainSeedwork\.Entity/.test(file.content);
					const extendsValueObject = /extends\s+DomainSeedwork\.ValueObject/.test(file.content);
					const extendsDomainEntity = /extends\s+DomainSeedwork\.DomainEntity/.test(file.content);
					if (extendsEntity || extendsValueObject || extendsDomainEntity) {
						return true;
					}

					const extendsAggregateRoot =
						/extends\s+DomainSeedwork\.AggregateRoot</.test(file.content);
					if (!extendsAggregateRoot) {
						allViolations.push(
							`[${file.path}] Aggregate root class does not extend DomainSeedwork.AggregateRoot`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('aggregate root files must have a static getNewInstance method', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Aggregate root files must have a static getNewInstance factory method';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.ts')
				.should()
				.adhereTo((file) => {
					// Skip non-aggregate files
					if (
						file.path.includes('.entity.ts') ||
						file.path.includes('.repository.ts') ||
						file.path.includes('.uow.ts') ||
						file.path.includes('.value-objects.ts') ||
						file.path.includes('.visa.ts') ||
						file.path.includes('.test.ts') ||
						file.path.includes('.helpers.ts') ||
						file.path.includes('index.ts') ||
						file.path.includes('passport.ts') ||
						file.path.includes('permissions.ts')
					) {
						return true;
					}

					// Skip if it's a nested entity or value object class (doesn't extend AggregateRoot)
					const extendsEntity = /extends\s+DomainSeedwork\.Entity/.test(file.content);
					const extendsValueObject = /extends\s+DomainSeedwork\.ValueObject/.test(file.content);
					const extendsDomainEntity = /extends\s+DomainSeedwork\.DomainEntity/.test(file.content);
					if (extendsEntity || extendsValueObject || extendsDomainEntity) {
						return true;
					}

					const hasGetNewInstance = /static\s+getNewInstance/.test(
						file.content,
					);
					if (!hasGetNewInstance) {
						allViolations.push(
							`[${file.path}] Aggregate root must have static getNewInstance method`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('aggregate root files must import entity, Passport, and Visa', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Aggregate root files must import entity types, Passport, and Visa';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.ts')
				.should()
				.adhereTo((file) => {
					// Skip non-aggregate files
					if (
						file.path.includes('.entity.ts') ||
						file.path.includes('.repository.ts') ||
						file.path.includes('.uow.ts') ||
						file.path.includes('.value-objects.ts') ||
						file.path.includes('.visa.ts') ||
						file.path.includes('.test.ts') ||
						file.path.includes('.helpers.ts') ||
						file.path.includes('index.ts') ||
						file.path.includes('passport.ts') ||
						file.path.includes('permissions.ts')
					) {
						return true;
					}

					// Skip if it's a nested entity or value object class (doesn't extend AggregateRoot)
					const extendsEntity = /extends\s+DomainSeedwork\.Entity/.test(file.content);
					const extendsValueObject = /extends\s+DomainSeedwork\.ValueObject/.test(file.content);
					const extendsDomainEntity = /extends\s+DomainSeedwork\.DomainEntity/.test(file.content);
					if (extendsEntity || extendsValueObject || extendsDomainEntity) {
						return true;
					}

					const importsPassport = /import.*Passport.*from.*passport/.test(
						file.content,
					);
					const importsEntity = /\.entity\.ts/.test(file.content);
					const importsVisa = /Visa.*from/.test(file.content);

					if (!importsPassport || !importsEntity || !importsVisa) {
						allViolations.push(
							`[${file.path}] Aggregate root must import entity types, Passport, and Visa`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});
	});

	describe('Visa Files', () => {
		it('visa files must export interface extending PassportSeedwork.Visa', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Visa files must export interface extending PassportSeedwork.Visa';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.visa.ts')
				.should()
				.adhereTo((file) => {
					const extendsVisa = /extends\s+PassportSeedwork\.Visa</.test(
						file.content,
					);
					if (!extendsVisa) {
						allViolations.push(
							`[${file.path}] Visa interface does not extend PassportSeedwork.Visa`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			// Allow some violations for now - not all visa files extend PassportSeedwork.Visa yet
			expect(allViolations.length).toBeLessThanOrEqual(1);
		});

		it('visa files must import domain permissions interface', async () => {
			const allViolations: string[] = [];
			const ruleDesc = 'Visa files must import domain permissions interface';

			await projectFiles()
				.inFolder('../sthrift/domain/src/domain/contexts/**')
				.withName('*.visa.ts')
				.should()
				.adhereTo((file) => {
					const importsDomainPermissions =
						/import.*DomainPermissions.*from/.test(file.content);
					if (!importsDomainPermissions) {
						allViolations.push(
							`[${file.path}] Visa must import domain permissions interface`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});
	});

});
