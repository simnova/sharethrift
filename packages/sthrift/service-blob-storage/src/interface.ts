import type { BlobUploadCommonResponse } from "@azure/storage-blob";
import type internal from "node:stream";

export interface FileInfo {
  name: string;
  url: string;
  size?: number;
  type?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, string>;
}

export interface BlobRequestSettings { 
  fileSizeBytes?:number;
  mimeType?:string;
  tags?:Record<string,string>;
  metadata?:Record<string,string>;
}

export type BlobAuthHeader = {
  authHeader?: string;
  blobName?: string;
  blobPath?: string;
  indexTags?: BlobIndexTag[];
  metadataFields?: BlobMetadataField[];
  requestDate?: string;
};

export type BlobIndexTag = {
  name: string;
  value: string;
};

export type BlobMetadataField = {
  name: string;
  value: string;
};

export interface BlobStorageBase {
  deleteBlob(blobName: string, containerName: string): Promise<void>;
  deleteFolder(folderName: string, containerName: string): Promise<void>;
  createTextBlob(blobName: string, containerName: string, text: string, contentType?: string, tags?: Record<string, string>, metadata?: Record<string, string>): Promise<void>;
  createTextBlobIfNotExistsAndConfirm(blobName: string, containerName: string, text: string, contentType?: string, tags?: Record<string, string>, callbackOnSuccess?: (blobText: string) => boolean): Promise<void>;
  createContainer(containerName: string, allowPublicAccess?: boolean): Promise<void>;
  listBlobs(containerName: string, path?: string): Promise<FileInfo[]>;
  findBlobsByTags(searchCriteria: string): Promise<FileInfo[]>;
  generateReadSasToken(blobName: string, containerName: string, minutesUntilExpiration: number): Promise<string>;
  generateSharedKey(blobName: string, fileSizeBytes: number, requestDate: string, mimeType: string, containerName: string): string;
  generateSharedKeyWithOptions(blobName: string, containerName: string, requestDate: string, requestSettings: BlobRequestSettings): string;
  generateSharedKeyLite(blobName: string, mimeType: string, containerName: string): string;
  writeStreamToBlob(blobName: string, containerName: string, stream: internal.Readable, contentType: string): Promise<BlobUploadCommonResponse>;
  readStreamFromBlob(blobName: string, containerName: string): Promise<NodeJS.ReadableStream>;
}