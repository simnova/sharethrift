import {
	describeDataSourcesMongooseModelsConventionTests,
	type DataSourcesMongooseModelsConventionTestsConfig,
} from '@cellix/arch-unit-tests/data-sources-mongoose-models';

const config: DataSourcesMongooseModelsConventionTestsConfig = {
	modelsGlob: '../data-sources-mongoose-models/src/models/**',
	allGlob: '../data-sources-mongoose-models/src/**',
};

describeDataSourcesMongooseModelsConventionTests(config);
