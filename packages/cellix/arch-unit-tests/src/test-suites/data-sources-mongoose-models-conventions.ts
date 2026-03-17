import { describe, expect, it } from 'vitest';
import {
	checkModelFileConventions,
	checkModelDependencyBoundaries,
	checkModelBarrelFiles,
	checkStandaloneModelConventions,
} from '../checks/data-sources-mongoose-models-conventions.js';

export interface DataSourcesMongooseModelsConventionTestsConfig {
	modelsGlob: string;
	allGlob: string;
}

export function describeDataSourcesMongooseModelsConventionTests(
	config: DataSourcesMongooseModelsConventionTestsConfig,
): void {
	describe('Data Sources Mongoose Models Conventions', () => {
		describe('Model File Conventions', () => {
			it('model files must export a *ModelFactory', async () => {
				const violations = await checkModelFileConventions({ modelsGlob: config.modelsGlob });
				expect(violations.filter((v) => v.includes('ModelFactory'))).toStrictEqual([]);
			}, 30000);

			it('model files must export a *ModelType type alias', async () => {
				const violations = await checkModelFileConventions({ modelsGlob: config.modelsGlob });
				expect(violations.filter((v) => v.includes('ModelType'))).toStrictEqual([]);
			}, 30000);

			it('model files must export a *ModelName constant', async () => {
				const violations = await checkModelFileConventions({ modelsGlob: config.modelsGlob });
				expect(violations.filter((v) => v.includes('ModelName'))).toStrictEqual([]);
			}, 30000);
		});

		describe('Dependency Boundaries', () => {
			it('must not import from domain, persistence, application-services, or graphql', async () => {
				const violations = await checkModelDependencyBoundaries({ allGlob: config.allGlob });
				expect(violations).toStrictEqual([]);
			}, 30000);
		});

		describe('Model Directory Structure', () => {
			it('model files must live in named subdirectories under models/', async () => {
				const violations = await checkModelBarrelFiles({ modelsGlob: config.modelsGlob });
				expect(violations).toStrictEqual([]);
			}, 30000);
		});

		describe('Standalone Model Conventions', () => {
			it('standalone models using modelFactory must extend MongooseSeedwork.Base', async () => {
				const violations = await checkStandaloneModelConventions({ modelsGlob: config.modelsGlob });
				expect(violations).toStrictEqual([]);
			}, 30000);
		});
	});
}
