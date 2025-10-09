import type { ServiceBlobStorage } from '@sthrift/service-blob-storage';
import type { Domain } from '@sthrift/domain';

export interface BlobDataSource {
	User: {
		withStorage: <T>(
			func: (
				passport: Domain.Passport,
				blobStorage: ServiceBlobStorage,
			) => Promise<T>,
		) => Promise<T>;
	};
}

export const BlobDataSourceImplementation = (
	passport: Domain.Passport,
	blobStorage: ServiceBlobStorage,
): BlobDataSource => ({
	User: {
		withStorage: async <T>(
			func: (
				passport: Domain.Passport,
				blobStorage: ServiceBlobStorage,
			) => Promise<T>,
		): Promise<T> => func(passport, blobStorage),
	},
});
