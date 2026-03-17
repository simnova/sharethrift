import { projectFiles } from 'archunit';

export interface PersistenceConventionsConfig {
	persistenceDomainGlob: string; // e.g. '../persistence/src/datasources/domain/**'
	persistenceReadonlyGlob: string; // e.g. '../persistence/src/datasources/readonly/**'
	persistenceAllGlob: string; // e.g. '../persistence/src/**'
}

/**
 * Check that domain repository files extend MongoRepositoryBase
 */
export async function checkPersistenceRepositoryConventions(
	config: Pick<PersistenceConventionsConfig, 'persistenceDomainGlob'>,
): Promise<string[]> {
	if (!config.persistenceDomainGlob) {
		throw new Error('checkPersistenceRepositoryConventions requires persistenceDomainGlob to be set');
	}

	const allViolations: string[] = [];

	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.repository.ts')
		.should()
		.adhereTo((file) => {
			const extendsBase = /extends\s+MongooseSeedwork\.MongoRepositoryBase</.test(file.content);
			if (!extendsBase) {
				allViolations.push(
					`[${file.path}] Repository class must extend MongooseSeedwork.MongoRepositoryBase`,
				);
				return false;
			}
			return true;
		}, 'Persistence repository classes must extend MongooseSeedwork.MongoRepositoryBase')
		.check();

	// Check implements domain repository interface
	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.repository.ts')
		.should()
		.adhereTo((file) => {
			const implementsDomainRepo = /implements\s+[\s\S]*?Domain\.Contexts\.\w/.test(file.content);
			if (!implementsDomainRepo) {
				allViolations.push(
					`[${file.path}] Repository must implement the corresponding Domain.Contexts.*.Repository interface`,
				);
				return false;
			}
			return true;
		}, 'Persistence repositories must implement domain repository interfaces')
		.check();

	return allViolations;
}

/**
 * Check that domain adapter files follow conventions
 */
export async function checkPersistenceDomainAdapterConventions(
	config: Pick<PersistenceConventionsConfig, 'persistenceDomainGlob'>,
): Promise<string[]> {
	if (!config.persistenceDomainGlob) {
		throw new Error('checkPersistenceDomainAdapterConventions requires persistenceDomainGlob to be set');
	}

	const allViolations: string[] = [];

	// Check extends MongooseDomainAdapter
	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.domain-adapter.ts')
		.should()
		.adhereTo((file) => {
			const extendsAdapter = /extends\s+MongooseSeedwork\.MongooseDomainAdapter</.test(file.content);
			if (!extendsAdapter) {
				allViolations.push(
					`[${file.path}] Domain adapter must extend MongooseSeedwork.MongooseDomainAdapter`,
				);
				return false;
			}
			return true;
		}, 'Domain adapters must extend MongooseSeedwork.MongooseDomainAdapter')
		.check();

	// Check has Converter class extending MongoTypeConverter
	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.domain-adapter.ts')
		.should()
		.adhereTo((file) => {
			const hasConverter = /extends\s+MongooseSeedwork\.MongoTypeConverter</.test(file.content);
			if (!hasConverter) {
				allViolations.push(
					`[${file.path}] Domain adapter file must contain a Converter class extending MongooseSeedwork.MongoTypeConverter`,
				);
				return false;
			}
			return true;
		}, 'Domain adapter files must contain a MongoTypeConverter')
		.check();

	return allViolations;
}

/**
 * Check that UoW files follow persistence conventions
 */
export async function checkPersistenceUnitOfWorkConventions(
	config: Pick<PersistenceConventionsConfig, 'persistenceDomainGlob'>,
): Promise<string[]> {
	if (!config.persistenceDomainGlob) {
		throw new Error('checkPersistenceUnitOfWorkConventions requires persistenceDomainGlob to be set');
	}

	const allViolations: string[] = [];

	// Check exports a factory function using MongoUnitOfWork
	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.uow.ts')
		.should()
		.adhereTo((file) => {
			const usesMongoUoW = /new\s+MongooseSeedwork\.MongoUnitOfWork\(/.test(file.content);
			if (!usesMongoUoW) {
				allViolations.push(
					`[${file.path}] UoW file must use MongooseSeedwork.MongoUnitOfWork`,
				);
				return false;
			}
			return true;
		}, 'Persistence UoW files must use MongooseSeedwork.MongoUnitOfWork')
		.check();

	// Check uses both InProcEventBusInstance and NodeEventBusInstance
	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.uow.ts')
		.should()
		.adhereTo((file) => {
			const hasInProc = /InProcEventBusInstance/.test(file.content);
			const hasNode = /NodeEventBusInstance/.test(file.content);
			if (!hasInProc || !hasNode) {
				allViolations.push(
					`[${file.path}] UoW must use both InProcEventBusInstance and NodeEventBusInstance`,
				);
				return false;
			}
			return true;
		}, 'Persistence UoW files must wire both event bus instances')
		.check();

	// Check exports a factory function (not a class)
	await projectFiles()
		.inFolder(config.persistenceDomainGlob)
		.withName('*.uow.ts')
		.should()
		.adhereTo((file) => {
			const exportsFactory = /export\s+const\s+get\w+UnitOfWork\s*=/.test(file.content);
			if (!exportsFactory) {
				allViolations.push(
					`[${file.path}] UoW must export a factory function named get*UnitOfWork`,
				);
				return false;
			}
			return true;
		}, 'Persistence UoW files must export a factory function')
		.check();

	return allViolations;
}

/**
 * Check that readonly data source files extend MongoDataSourceImpl
 */
export async function checkPersistenceReadonlyDataConventions(
	config: Pick<PersistenceConventionsConfig, 'persistenceReadonlyGlob'>,
): Promise<string[]> {
	if (!config.persistenceReadonlyGlob) {
		throw new Error('checkPersistenceReadonlyDataConventions requires persistenceReadonlyGlob to be set');
	}

	const allViolations: string[] = [];

	await projectFiles()
		.inFolder(config.persistenceReadonlyGlob)
		.withName('*.data.ts')
		.should()
		.adhereTo((file) => {
			const extendsBase = /extends\s+MongoDataSourceImpl</.test(file.content);
			if (!extendsBase) {
				allViolations.push(
					`[${file.path}] Readonly data source must extend MongoDataSourceImpl`,
				);
				return false;
			}
			return true;
		}, 'Readonly data source files must extend MongoDataSourceImpl')
		.check();

	return allViolations;
}

/**
 * Check that persistence layer does not have upward dependencies
 */
export async function checkPersistenceDependencyBoundaries(
	config: Pick<PersistenceConventionsConfig, 'persistenceAllGlob'>,
): Promise<string[]> {
	if (!config.persistenceAllGlob) {
		throw new Error('checkPersistenceDependencyBoundaries requires persistenceAllGlob to be set');
	}

	const allViolations: string[] = [];

	// Check no imports from application-services
	await projectFiles()
		.inPath(config.persistenceAllGlob)
		.should()
		.adhereTo((file) => {
			if (file.path.includes('.test.ts') || file.path.includes('.feature')) return true;
			const importsAppServices = /@sthrift\/application-services/.test(file.content);
			if (importsAppServices) {
				allViolations.push(
					`[${file.path}] Persistence must not import from @sthrift/application-services`,
				);
				return false;
			}
			return true;
		}, 'Persistence layer must not depend on application services')
		.check();

	// Check no imports from graphql
	await projectFiles()
		.inPath(config.persistenceAllGlob)
		.should()
		.adhereTo((file) => {
			if (file.path.includes('.test.ts') || file.path.includes('.feature')) return true;
			const importsGraphql = /@sthrift\/graphql/.test(file.content);
			if (importsGraphql) {
				allViolations.push(
					`[${file.path}] Persistence must not import from @sthrift/graphql`,
				);
				return false;
			}
			return true;
		}, 'Persistence layer must not depend on GraphQL layer')
		.check();

	return allViolations;
}

/**
 * Check that messaging/payment persistence files depend on abstractions
 */
export async function checkPersistenceAbstractionDependencies(
	config: Pick<PersistenceConventionsConfig, 'persistenceAllGlob'>,
): Promise<string[]> {
	if (!config.persistenceAllGlob) {
		throw new Error('checkPersistenceAbstractionDependencies requires persistenceAllGlob to be set');
	}

	const allViolations: string[] = [];

	// Check messaging files don't import concrete implementations
	await projectFiles()
		.inPath(config.persistenceAllGlob)
		.should()
		.adhereTo((file) => {
			if (file.path.includes('.test.ts') || file.path.includes('.feature')) return true;
			if (!file.path.includes('/messaging/')) return true;

			const importsConcrete = /@cellix\/service-messaging-(?!base)/.test(file.content);
			if (importsConcrete) {
				allViolations.push(
					`[${file.path}] Messaging persistence must depend on @cellix/service-messaging-base, not concrete implementations`,
				);
				return false;
			}
			return true;
		}, 'Messaging persistence must depend on abstractions')
		.check();

	// Check payment files don't import concrete implementations
	await projectFiles()
		.inPath(config.persistenceAllGlob)
		.should()
		.adhereTo((file) => {
			if (file.path.includes('.test.ts') || file.path.includes('.feature')) return true;
			if (!file.path.includes('/payment/')) return true;

			const importsConcrete = /@cellix\/service-payment-(?!base)/.test(file.content);
			if (importsConcrete) {
				allViolations.push(
					`[${file.path}] Payment persistence must depend on @cellix/service-payment-base, not concrete implementations`,
				);
				return false;
			}
			return true;
		}, 'Payment persistence must depend on abstractions')
		.check();

	return allViolations;
}
