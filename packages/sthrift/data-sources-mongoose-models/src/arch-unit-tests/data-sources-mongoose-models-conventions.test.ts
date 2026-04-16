import {
	describeDataSourcesMongooseModelsConventionTests,
	type DataSourcesMongooseModelsConventionTestsConfig,
} from '@cellix/arch-unit-tests/data-sources-mongoose-models';
import {
	describeDataSourcesMongooseModelsConventionTests as describeShareThriftDataSourcesMongooseModelsConventionTests,
	type DataSourcesMongooseModelsConventionTestsConfig as ShareThriftDataSourcesMongooseModelsConventionTestsConfig,
} from '@sthrift-verification/arch-unit-tests/data-sources-mongoose-models';

const cellixConfig: DataSourcesMongooseModelsConventionTestsConfig = {
	modelsGlob: '../data-sources-mongoose-models/src/models/**',
	allGlob: '../data-sources-mongoose-models/src/**',
};

const shareThriftConfig: ShareThriftDataSourcesMongooseModelsConventionTestsConfig = {
	modelsGlob: '../data-sources-mongoose-models/src/models/**',
	allGlob: '../data-sources-mongoose-models/src/**',
};

describeDataSourcesMongooseModelsConventionTests(cellixConfig);
describeShareThriftDataSourcesMongooseModelsConventionTests(shareThriftConfig);
