import type { ServiceBase } from '@cellix/api-services-spec';
import type { Domain } from '@sthrift/domain';
import { BlobServiceClient } from '@azure/storage-blob';

export class ServiceBlobStorage implements ServiceBase<Domain.Services["BlobStorage"]> {
    private blobServiceClient: BlobServiceClient | undefined;

    async startUp(): Promise<Domain.Services["BlobStorage"]> {

        // Use connection string from environment variable or config
        // biome-ignore lint:useLiteralKeys
        const connectionString = process.env['AZURE_STORAGE_CONNECTION_STRING'];
        if (!connectionString) {
            throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
        }

        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // Return an implementation of the BlobStorage service interface
        return await Promise.resolve(this);
    }

    async createValetKey(storageAccount: string, path: string, expiration: Date): Promise<string> {
        return await Promise.resolve(`Valet key for ${storageAccount}/${path} valid until ${expiration.toISOString()}`);
    }

    async deleteBlob(containerName: string, blobPath: string): Promise<void> {
        if (!this.blobServiceClient) {
            throw new Error('BlobServiceClient is not initialized');
        }
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobPath);
        await blobClient.deleteIfExists();
    }

    shutDown(): Promise<void> {
        console.log('ServiceBlobStorage stopped');
        return Promise.resolve();
    }

}