import { BlobRequest } from './blob-request';
import { AuthHeader } from './auth-header';
import { AccountInfo } from './account-info';
import { BlobActions } from './blob-actions';

export class BlobStorage {

  private readonly containerName:string;
  private readonly accountName:string;
  private readonly accountKey:string;

  constructor(){
    const {containerName,accountName,accountKey} = AccountInfo.getInstance().getSettings();
    this.containerName = containerName;
    this.accountName = accountName;
    this.accountKey = accountKey;
  }

  public deleteBlob(blobName:string):Promise<void>{
    return (new BlobActions(this.accountName,this.accountKey)).deleteBlob(blobName,this.containerName);
  }

  public generateSharedKey(blobName:string,fileSizeBytes:number,requestDate:string,mimeType:string):string{
    var blobRequest = (new BlobRequest()).createRequest(
      this.accountName,
      this.containerName,
      blobName,
      fileSizeBytes,
      requestDate,
      mimeType
    );
    return new AuthHeader().generateFromRequest(blobRequest,this.accountName, this.accountKey);
  }

  public generateSharedKeyLite(blobName:string,mimeType:string):string{
    var blobRequest = (new BlobRequest()).createRequestLite(
      this.accountName,
      this.containerName,
      blobName,
      mimeType
    );
    return new AuthHeader().generateFromRequestLite(blobRequest,this.accountName, this.accountKey);
  }
  
}