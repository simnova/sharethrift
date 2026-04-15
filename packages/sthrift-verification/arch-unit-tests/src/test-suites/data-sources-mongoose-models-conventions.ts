import { describe, expect, it } from 'vitest';
import { checkShareThriftModelExportNaming } from '../checks/data-sources-mongoose-models-conventions.js';

export interface DataSourcesMongooseModelsConventionTestsConfig
{
	modelsGlob: string;
	allGlob: string;
}

export function describeDataSourcesMongooseModelsConventionTests(
	config: DataSourcesMongooseModelsConventionTestsConfig,
): void {
	describe('ShareThrift Data Sources Mongoose Models Conventions', () => {
		it('model export names must match the model file name', async () => {
			const violations = await checkShareThriftModelExportNaming({
				modelsGlob: config.modelsGlob,
			});
			expect(violations).toStrictEqual([]);
		}, 30000);
	});
}
