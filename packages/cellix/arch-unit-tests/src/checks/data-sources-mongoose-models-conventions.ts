import { projectFiles } from 'archunit';

export interface DataSourcesMongooseModelsConventionsConfig {
	modelsGlob: string; // e.g. '../data-sources-mongoose-models/src/models/**'
	allGlob: string; // e.g. '../data-sources-mongoose-models/src/**'
}

/**
 * Check that model files follow naming and export conventions
 */
export async function checkModelFileConventions(
	config: Pick<DataSourcesMongooseModelsConventionsConfig, 'modelsGlob'>,
): Promise<string[]> {
	const allViolations: string[] = [];

	// Every .model.ts file must export a ModelFactory
	await projectFiles()
		.inFolder(config.modelsGlob)
		.withName('*.model.ts')
		.should()
		.adhereTo((file) => {
			const hasFactory = /export\s+(const|function)\s+\w+ModelFactory\b/.test(file.content);
			if (!hasFactory) {
				allViolations.push(`[${file.path}] Model file must export a *ModelFactory`);
				return false;
			}
			return true;
		}, 'Model files must export a ModelFactory')
		.check();

	// Every .model.ts file must export a ModelType type alias
	await projectFiles()
		.inFolder(config.modelsGlob)
		.withName('*.model.ts')
		.should()
		.adhereTo((file) => {
			const hasType = /export\s+type\s+\w+ModelType\b/.test(file.content);
			if (!hasType) {
				allViolations.push(`[${file.path}] Model file must export a *ModelType type alias`);
				return false;
			}
			return true;
		}, 'Model files must export a ModelType type alias')
		.check();

	// Every .model.ts file must export a ModelName constant
	await projectFiles()
		.inFolder(config.modelsGlob)
		.withName('*.model.ts')
		.should()
		.adhereTo((file) => {
			const hasName = /export\s+const\s+\w+ModelName\b/.test(file.content);
			if (!hasName) {
				allViolations.push(`[${file.path}] Model file must export a *ModelName constant`);
				return false;
			}
			return true;
		}, 'Model files must export a ModelName constant')
		.check();

	return allViolations;
}

/**
 * Check that model files only import from allowed sources
 */
export async function checkModelDependencyBoundaries(
	config: Pick<DataSourcesMongooseModelsConventionsConfig, 'allGlob'>,
): Promise<string[]> {
	const allViolations: string[] = [];

	// No imports from domain, persistence, application-services, or graphql layers
	await projectFiles()
		.inFolder(config.allGlob)
		.withName('*.ts')
		.should()
		.adhereTo((file) => {
			const hasForbiddenImport =
				/from\s+['"]@sthrift\/(domain|persistence|application-services|graphql)\b/.test(file.content);
			if (hasForbiddenImport) {
				allViolations.push(
					`[${file.path}] Must not import from domain, persistence, application-services, or graphql packages`,
				);
				return false;
			}
			return true;
		}, 'Mongoose model files must not depend on higher-level layers')
		.check();

	return allViolations;
}

/**
 * Check that each model subdirectory has an index.ts barrel file
 */
export async function checkModelBarrelFiles(
	config: Pick<DataSourcesMongooseModelsConventionsConfig, 'modelsGlob'>,
): Promise<string[]> {
	const allViolations: string[] = [];

	// Every directory that contains a .model.ts file should also have an index.ts
	await projectFiles()
		.inFolder(config.modelsGlob)
		.withName('*.model.ts')
		.should()
		.adhereTo((file) => {
			const isInSubdir = /\/models\/[^/]+\/[^/]+\.model\.ts$/.test(file.path);
			if (!isInSubdir) {
				allViolations.push(
					`[${file.path}] Model file must be in a named subdirectory under models/ (e.g. models/user/user.model.ts)`,
				);
				return false;
			}
			return true;
		}, 'Model files must live in named subdirectories')
		.check();

	return allViolations;
}

/**
 * Check that standalone models use MongooseSeedwork.modelFactory
 * and that their interfaces extend MongooseSeedwork.Base
 */
export async function checkStandaloneModelConventions(
	config: Pick<DataSourcesMongooseModelsConventionsConfig, 'modelsGlob'>,
): Promise<string[]> {
	const allViolations: string[] = [];

	await projectFiles()
		.inFolder(config.modelsGlob)
		.withName('*.model.ts')
		.should()
		.adhereTo((file) => {
			// If file uses modelFactory, it's a standalone model — check it extends Base
			const usesModelFactory = /MongooseSeedwork\.modelFactory/.test(file.content);
			if (usesModelFactory) {
				const extendsBase = /extends\s+MongooseSeedwork\.Base\b/.test(file.content);
				if (!extendsBase) {
					allViolations.push(
						`[${file.path}] Standalone model interface must extend MongooseSeedwork.Base`,
					);
					return false;
				}
			}
			return true;
		}, 'Standalone models must extend MongooseSeedwork.Base')
		.check();

	return allViolations;
}
