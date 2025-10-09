import { BlobSASPermissions, BlobServiceClient, BlockBlobClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import type {
  BlobGenerateSasUrlOptions,
  ContainerCreateOptions,
  ContainerListBlobsOptions,
  PublicAccessType,
  BlobDownloadResponseParsed,
} from "@azure/storage-blob";
import type internal from "node:stream";
import type { FileInfo } from "./interface.ts";

export class BlobActions {
  private readonly sharedKeyCredential: StorageSharedKeyCredential;
  private readonly accountName: string;
  private readonly accountKey: string;

  public constructor(accountName: string, accountKey: string) {
    this.accountName = accountName;
    this.accountKey = accountKey;
    this.sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
  }

  public generateReadSasToken = (blobName: string, containerName: string, minutesUntilExpiration: number): Promise<string> => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);

    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + minutesUntilExpiration);

    const permissions = new BlobSASPermissions();
    permissions.read = true;

    const options: BlobGenerateSasUrlOptions = {
      startsOn: startDate,
      expiresOn: expiryDate,
      permissions: permissions,
    };

    return blobClient.generateSasUrl(options);
  };

  /**
   * @param tagQuery
   * example: "@container='mycontainer' AND createDate >  '2021-01-01T00:00:00Z' AND createDate < '2021-01-02T00:00:00Z'"
   
   */
  public findBlobsByTags = async (tagQuery: string): Promise<FileInfo[]> => {
    const blobServiceClient = new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net/`, this.sharedKeyCredential);

  const blobList: FileInfo[] = [];
    for await (const blob of blobServiceClient.findBlobsByTags(tagQuery)) {
      blobList.push({
        //contentLength and contentType are not available in the findBlobsByTagsResponse https://learn.microsoft.com/en-us/rest/api/storageservices/find-blobs-by-tags
        name: blob.name,
        url: `https://${this.accountName}.blob.core.windows.net/${blob.containerName}/${blob.name}`,
        tags: blob.tags ?? {},
      });
    }
    return blobList;
  };

  public listBlobs = async (containerName: string, prefix?: string): Promise<FileInfo[]> => {
    const blobServiceClient = new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net/`, this.sharedKeyCredential);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const options: ContainerListBlobsOptions = {
      includeMetadata: true,
      includeTags: true,
    };
    if (prefix) {
      options.prefix = prefix;
    }

  const blobList: FileInfo[] = [];
    for await (const blob of containerClient.listBlobsFlat(options)) {
      blobList.push({
        name: blob.name,
        url: `https://${this.accountName}.blob.core.windows.net/${containerName}/${blob.name}`,
        size: blob.properties.contentLength ?? 0,
        type: blob.properties.contentType ?? "",
        tags: blob.tags ?? {},
        metadata: blob.metadata ?? {},
      });
    }
    return blobList;
  };

  public deleteBlob = async (blobName: string, container: string) => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${container}/${blobName}`;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);
    await blobClient.delete();
  };

  public deleteFolder = async (folderName: string, container: string) => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/`;
    const blobServiceClient = new BlobServiceClient(blobUrl, this.sharedKeyCredential);
    const containerClient = blobServiceClient.getContainerClient(container);

    // List and delete all blobs with the specified prefix (folder path)
    for await (const blob of containerClient.listBlobsFlat({ prefix: folderName })) {
      const blobClient = containerClient.getBlobClient(blob.name);
      await blobClient.delete();
      console.log(`Deleted blob: ${blob.name}`);
    }
  };

  public writeStreamToBlob = (
    blobName: string,
    container: string,
    stream: internal.Readable,
    contentType: string = "application/octet-stream"
  ) => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${container}/${blobName}`;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);
    return blobClient.uploadStream(stream, undefined, undefined, { blobHTTPHeaders: { blobContentType: contentType } });
  };

  public readStreamFromBlob = (blobName: string, container: string, _offset?: number, _count?: number): Promise<BlobDownloadResponseParsed> => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${container}/${blobName}`;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);
    return blobClient.download(0);
  };

  public createTextBlob = async (
    blobName: string,
    container: string,
    text: string,
    contentType: string = "text/plain",
    indexTags?: Record<string, string>,
    metadata?: Record<string, string>
  ) => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${container}/${blobName}`;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);
    await blobClient.upload(text, text.length, { blobHTTPHeaders: { blobContentType: contentType }, tags: indexTags ?? {}, metadata: metadata ?? {} });
  };

  public createTextBlobIfNotExistsAndConfirm = async (
    blobName: string,
    container: string,
    text: string,
    contentType: string = "text/plain",
    tags?: Record<string, string>,
    callbackOnSuccess?: (blobText: string) => boolean
  ) => {
    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${container}/${blobName}`;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);
    try {
      await blobClient.upload(text, text.length, { blobHTTPHeaders: { blobContentType: contentType }, tags: tags ?? {}, conditions: { ifNoneMatch: "*" } });
    } catch (error) {
      const err = error as { name?: string; statusCode?: number };
      if (err.name === "RestError" && err.statusCode === 409) {
        console.log(`blob-already-exists | ${blobName}`);
      } else {
        throw error;
      }
    } finally {
      const authenticatedBlobUrl = await this.generateReadSasToken(blobName, container, 1);
      try {
        await fetch(authenticatedBlobUrl)
          .then((response) => response.text())
          .then((text) => {
            if (!callbackOnSuccess) {
              console.log("Blob created successfully");
            } else if (callbackOnSuccess(text)) {
              console.log("Blob created successfully and the file contents are valid");
            } else {
              console.log("Blob created successfully but the file contents are invalid");
              throw new Error(`invalid-file-contents | ${blobName}`);
            }
          });
      } catch (error) {
        console.log(`Error fetching blob: ${error}`);
      }
    }
  };

  public createContainer = async (container: string, allowPublicAccess: boolean) => {
    const blobServiceClient = new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net/`, this.sharedKeyCredential);
    const containerClient = blobServiceClient.getContainerClient(container);

    const options: ContainerCreateOptions = {};
    if (allowPublicAccess) {
      options.access = "blob" as PublicAccessType;
    }

    await containerClient.create(options);
  };
}
