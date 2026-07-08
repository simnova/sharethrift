import { BlobSASPermissions, BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';

export interface ServiceBlobStorageOptions {
	accountName?: string;
	connectionString?: string;
}

export interface BlobAddress {
	containerName: string;
	blobName: string;
}
export interface UploadTextBlobRequest extends BlobAddress {
	content: string;
	contentType?: string;
}
export interface ListBlobsRequest {
	containerName: string;
	prefix?: string;
}
export interface BlobListItem {
	name: string;
	contentType?: string;
}
export interface CreateBlobAuthorizationHeaderRequest extends BlobAddress {
	contentLength?: number;
	contentType?: string;
	expiresOn?: Date;
}

function connectionString(options: ServiceBlobStorageOptions): string {
	// biome-ignore lint/complexity/useLiteralKeys: process.env is an index-signature under the shared TypeScript config.
	return options.connectionString ?? process.env['AZURE_STORAGE_CONNECTION_STRING'] ?? 'UseDevelopmentStorage=true';
}

export class ServiceBlobStorage {
	private client: BlobServiceClient | undefined;
	constructor(private readonly options: ServiceBlobStorageOptions = {}) {}
	startUp(): Promise<ServiceBlobStorage> {
		this.client = BlobServiceClient.fromConnectionString(connectionString(this.options));
		return Promise.resolve(this);
	}
	shutDown(): Promise<void> {
		this.client = undefined;
		return Promise.resolve();
	}
	async uploadText(request: UploadTextBlobRequest): Promise<void> {
		const container = this.requireClient().getContainerClient(request.containerName);
		await container.createIfNotExists();
		await container.getBlockBlobClient(request.blobName).upload(request.content, Buffer.byteLength(request.content), request.contentType ? { blobHTTPHeaders: { blobContentType: request.contentType } } : {});
	}
	async listBlobs(request: ListBlobsRequest): Promise<BlobListItem[]> {
		const items: BlobListItem[] = [];
		for await (const item of this.requireClient()
			.getContainerClient(request.containerName)
			.listBlobsFlat(request.prefix ? { prefix: request.prefix } : {})) {
			items.push({
				name: item.name,
				...(item.properties.contentType ? { contentType: item.properties.contentType } : {}),
			});
		}
		return items;
	}
	async deleteBlob(address: BlobAddress): Promise<void> {
		await this.requireClient().getContainerClient(address.containerName).deleteBlob(address.blobName, { deleteSnapshots: 'include' });
	}
	createValetKey(storageAccount: string, path: string, expiration: Date): Promise<string> {
		return Promise.resolve(`${storageAccount}/${path}?expires=${encodeURIComponent(expiration.toISOString())}`);
	}
	private requireClient(): BlobServiceClient {
		if (!this.client) throw new Error('ServiceBlobStorage has not been started');
		return this.client;
	}
}

export class ServiceClientBlobStorage {
	constructor(private readonly options: ServiceBlobStorageOptions = {}) {}
	startUp(): Promise<ServiceClientBlobStorage> {
		return Promise.resolve(this);
	}
	shutDown(): Promise<void> {
		return Promise.resolve();
	}
	createBlobWriteAuthorizationHeader(request: CreateBlobAuthorizationHeaderRequest) {
		return this.authorize(request, 'cw');
	}
	createBlobReadAuthorizationHeader(request: CreateBlobAuthorizationHeaderRequest) {
		return this.authorize(request, 'r');
	}
	private authorize(request: CreateBlobAuthorizationHeaderRequest, permissions: string) {
		const parsed = parseConnectionString(connectionString(this.options));
		const credential = new StorageSharedKeyCredential(parsed.accountName, parsed.accountKey);
		const expiresOn = request.expiresOn ?? new Date(Date.now() + 15 * 60_000);
		const sas = generateBlobSASQueryParameters(
			{
				containerName: request.containerName,
				blobName: request.blobName,
				permissions: BlobSASPermissions.parse(permissions),
				expiresOn,
			},
			credential,
		).toString();
		return Promise.resolve({
			url: `https://${parsed.accountName}.blob.core.windows.net/${request.containerName}/${request.blobName}?${sas}`,
			headers: request.contentType ? { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': request.contentType } : { 'x-ms-blob-type': 'BlockBlob' },
			expiresOn,
		});
	}
}

function parseConnectionString(value: string): {
	accountName: string;
	accountKey: string;
} {
	if (value === 'UseDevelopmentStorage=true') {
		throw new Error('Blob signing requires an explicit Azurite connection string with AccountName and AccountKey');
	}
	const entries = Object.fromEntries(value.split(';').map((part) => part.split('=', 2) as [string, string]));
	// biome-ignore lint/complexity/useLiteralKeys: parsed connection-string fields use an index signature.
	const accountName = entries['AccountName'];
	// biome-ignore lint/complexity/useLiteralKeys: parsed connection-string fields use an index signature.
	const accountKey = entries['AccountKey'];
	if (!accountName || !accountKey) throw new Error('Blob signing requires AccountName and AccountKey');
	return { accountName, accountKey };
}
