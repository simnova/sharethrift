import { BlobRequest } from './blob-request.ts';
import { AuthHeader } from './auth-header.ts';
import {  BlobActions } from './blob-actions.ts';
import type internal from 'node:stream';
import type { BlobUploadCommonResponse } from '@azure/storage-blob';
import type { ServiceBase } from "@cellix/api-services-spec";

import type { BlobRequestSettings, BlobStorageBase, FileInfo } from './interface.ts';

export * from './interface.ts';

export class ServiceBlobStorage implements BlobStorageBase, ServiceBase<ServiceBlobStorage> {

  private readonly accountName:string;
  private readonly accountKey:string;

//   constructor(accountName:string, accountKey:string){
  constructor(){
    
    // if (!process.env['STORAGE_ACCOUNT_NAME'] || !process.env['STORAGE_ACCOUNT_KEY']) {
    //   throw new Error('STORAGE_ACCOUNT_NAME and STORAGE_ACCOUNT_KEY must be set in environment variables');
    // }
    // this.accountName = process.env['STORAGE_ACCOUNT_NAME']
    // this.accountKey = process.env['STORAGE_ACCOUNT_KEY'];
      this.accountName = "teststorageaccount"
    this.accountKey = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="
  }

  public startUp(): Promise<Exclude<ServiceBlobStorage, ServiceBase>> {
    console.log("ServiceBlobStorage started");
    return Promise.resolve(this as Exclude<ServiceBlobStorage, ServiceBase>);
  }

  public shutDown(): Promise<void> {
    return Promise.resolve();
  }

  public deleteBlob(blobName:string, containerName:string):Promise<void>{
    return (new BlobActions(this.accountName,this.accountKey)).deleteBlob(blobName,containerName);
  }

  public deleteFolder(blobName:string, containerName:string):Promise<void>{
    return (new BlobActions(this.accountName,this.accountKey)).deleteFolder(blobName,containerName);
  }

  public writeStreamToBlob(blobName:string,containerName:string,stream:internal.Readable,contentType:string):Promise<BlobUploadCommonResponse>{
    return (new BlobActions(this.accountName,this.accountKey)).writeStreamToBlob(blobName,containerName,stream,contentType);
  }

  public async readStreamFromBlob(blobName:string,containerName:string):Promise<NodeJS.ReadableStream>{
    const response = await (new BlobActions(this.accountName, this.accountKey)).readStreamFromBlob(blobName, containerName);
    if (!response.readableStreamBody) {
      throw new Error('Failed to get readable stream from blob.');
    }
    return response.readableStreamBody;
  }

  /**
   * Creates a text blob in the blob storage account
   * @param blobName The name of the blob to create
   * @param containerName The name of the container to create the blob in
   * @param text The text to store in the blob
   * @param contentType (optional) The content type of the blob (default: text/plain)
   * full details: https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
   * */
  public createTextBlob(blobName:string,containerName:string,text:string,contentType?:string, tags?: Record<string,string>, metadata?:Record<string,string>):Promise<void>{
    return (new BlobActions(this.accountName,this.accountKey)).createTextBlob(blobName,containerName,text,contentType,tags,metadata);
  }

  /**
   * Creates a text blob if it does not exist and process callback function after file upload succeeds
  * @param blobName The name of the blob to create
   * @param containerName The name of the container to create the blob in
   * @param text The text to store in the blob
   * @param contentType (optional) The content type of the blob (default: text/plain)
   * @param tags (optional) The index tags to add to the blob
   * @param callbackOnSuccess (optional) The callback function which validates the file contents of the blob after upload
   */
  public createTextBlobIfNotExistsAndConfirm(blobName: string, containerName: string, text: string, contentType:string='text/plain', tags?: Record<string, string>, callbackOnSuccess?: (blobText: string) => boolean):Promise<void>{
    return (new BlobActions(this.accountName,this.accountKey)).createTextBlobIfNotExistsAndConfirm(blobName,containerName,text,contentType,tags,callbackOnSuccess);
  }
  /**
   * Creates a container in the blob storage account
   * @param containerName The name of the container to create
   * @param allowPublicAccess If true, the container will be created with public access (default: true)
   * full details: https://docs.microsoft.com/en-us/rest/api/storageservices/create-container
   * */
  public createContainer(containerName:string, allowPublicAccess:boolean = true):Promise<void>{
    return (new BlobActions(this.accountName,this.accountKey)).createContainer(containerName,allowPublicAccess);
  }

  /**
   * Lists all blobs in a container filtered by a path
   * @param containerName The name of the container to list
   * @param path (optional) prefix of the full blob name to filter the blobs in the container
   * full details: https://docs.microsoft.com/en-us/rest/api/storageservices/list-blobs
   * */
  public listBlobs(containerName:string, prefix?:string):Promise<FileInfo[]>{
    return (new BlobActions(this.accountName,this.accountKey)).listBlobs(containerName,prefix);
  }

  /**
   * Lists all blobs in a storage account filtered by a tag query
   * @param tagQuery The tag query to filter the blobs
   * query syntax: https://docs.microsoft.com/en-us/rest/api/storageservices/find-blobs-by-tags#query-syntax
   * */
  public findBlobsByTags(tagQuery:string):Promise<FileInfo[]>{
    return (new BlobActions(this.accountName,this.accountKey)).findBlobsByTags(tagQuery);
  }


  public generateReadSasToken(blobName:string,containerName:string,minutesUntilExpiration:number):Promise<string>{
    return (new BlobActions(this.accountName,this.accountKey)).generateReadSasToken(blobName,containerName,minutesUntilExpiration);
  }

  public generateSharedKeyWithOptions(blobName:string,containerName:string,requestDate:string,requestSettings:BlobRequestSettings):string{
    const blobRequest = (new BlobRequest()).createRequest(
    this.accountName,
    containerName,
    blobName,
    requestDate,
    requestSettings
  );
  return new AuthHeader().generateFromRequest(blobRequest,this.accountName, this.accountKey);
  }

  public generateSharedKey(blobName:string,fileSizeBytes:number,requestDate:string,mimeType:string, containerName:string):string{
    const blobRequest = (new BlobRequest()).createRequest(
      this.accountName,
      containerName,
      blobName,
      requestDate,
      {
        fileSizeBytes: fileSizeBytes,
        mimeType: mimeType
      }
    );
    return new AuthHeader().generateFromRequest(blobRequest,this.accountName, this.accountKey);
  }

  public generateSharedKeyLite(blobName:string,mimeType:string,containerName:string):string{
    const blobRequest = (new BlobRequest()).createRequestLite(
      this.accountName,
      containerName,
      blobName,
      mimeType
    );
    return new AuthHeader().generateFromRequestLite(blobRequest,this.accountName, this.accountKey);
  }
  
}

// Minimal infrastructure service aligning with existing service pattern
