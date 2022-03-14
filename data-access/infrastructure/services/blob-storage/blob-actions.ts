import { BlockBlobClient, StorageSharedKeyCredential } from '@azure/storage-blob';

export class BlobActions {
  private readonly sharedKeyCredential:StorageSharedKeyCredential;
  public constructor(private accountName: string, private accountKey: string) {
    this.sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey)
  }

  public deleteBlob = async (blobName:string, container:string) =>{
    var blobUrl = 'https://' + this.accountName + '.blob.core.windows.net/' + container + '/' + blobName;
    const blobClient = new BlockBlobClient(blobUrl, this.sharedKeyCredential);
    await blobClient.delete();
  }
}