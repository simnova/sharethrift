import type { ServiceBase } from '@cellix/api-services-spec';
import type { Domain } from '@sthrift/domain';

type BlobStorageService = Domain.Services.Services["BlobStorage"];

export class ServiceBlobStorage implements ServiceBase<BlobStorageService> {

    async startUp(): Promise<BlobStorageService> {

        // Use connection string from environment variable or config
        // biome-ignore lint:useLiteralKeys
        const connectionString = process.env['AZURE_STORAGE_CONNECTION_STRING'];
        if (!connectionString) {
            throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
        }

        // Return an implementation of the BlobStorage service interface
        return await Promise.resolve(this);
    }

    async createValetKey(storageAccount: string, path: string, expiration: Date): Promise<string> {
        return await Promise.resolve(`Valet key for ${storageAccount}/${path} valid until ${expiration.toISOString()}`);
    }
    shutDown(): Promise<void> {
        console.log('ServiceBlobStorage stopped');
        return Promise.resolve();
    }

}