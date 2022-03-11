import { HeaderConstants } from './constants';
import { WebResource } from '@azure/storage-blob';


/*
 * Wrapper for https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
 */
export class BlobRequest {

  /*
   * Creates a webResource for a PUT request with required headers to upload a block blob.
  */
  public createRequest(accountName:string, containerName:string, blobName: string, fileSizeBytes:number, requestDate:string, mimeType:string='application/octet-stream'): WebResource {
    const webResource = new WebResource();

    // HTTP Headers
    webResource.method = 'PUT';
    webResource.url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    webResource.headers.set(HeaderConstants.CONTENT_TYPE, mimeType);
    webResource.headers.set(HeaderConstants.CONTENT_LENGTH, fileSizeBytes);

    // Canocicalized Headers
    webResource.headers.set(HeaderConstants.X_MS_BLOB_TYPE, 'BlockBlob');
    webResource.headers.set(HeaderConstants.X_MS_DATE,requestDate);
    webResource.headers.set(HeaderConstants.X_MS_VERSION,'2021-04-10'); 

    // Canocicalized Resource
    webResource.headers.set(accountName, `/${accountName}/${containerName}/${blobName}`);
    
    return webResource;
  }

  public createRequestLite(accountName:string, containerName:string, blobName: string, mimeType:string='application/octet-stream'): WebResource {
    const webResource = new WebResource();

    // HTTP Headers
    webResource.method = 'PUT';
    webResource.url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    webResource.headers.set(HeaderConstants.CONTENT_TYPE, mimeType);

    // Canocicalized Headers
    webResource.headers.set(HeaderConstants.X_MS_BLOB_TYPE, 'BlockBlob');
    webResource.headers.set(HeaderConstants.X_MS_DATE, new Date().toUTCString());
    webResource.headers.set(HeaderConstants.X_MS_VERSION,'2021-04-10'); 

    // Canocicalized Resource
    webResource.headers.set(accountName, `/${accountName}/${containerName}/${blobName}`);

    return webResource;
  }


}