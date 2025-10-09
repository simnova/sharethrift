import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Models } from '@sthrift/data-sources-mongoose-models';
import { DataSourcesFactoryImpl } from './datasources/index.ts';
import type { ModelsContext } from './models-context.ts';
import type { ServiceBlobStorage } from '@sthrift/service-blob-storage';
// import type { BlobDataSourceImplementation } from './datasources/blob-storage/index.ts';

export type { DataSources, DataSourcesFactory } from './datasources/index.ts';

export const Persistence = (
    initializedService: MongooseSeedwork.MongooseContextFactory,
    initializedBlobStorageService: ServiceBlobStorage
    // initializedBlobStorageService: BlobDataSourceImplementation
) => {
  if (!initializedService?.service) {
    throw new Error('MongooseSeedwork.MongooseContextFactory is required');
  }

  const models: ModelsContext = {
    ...Models.mongooseContextBuilder(initializedService),
  };

  return DataSourcesFactoryImpl(models, initializedBlobStorageService);
};
