import type { BlobRequestSettings } from './interface.ts';
import { HeaderConstants } from './constants.ts';
import { WebResource } from '@azure/core-http';

/*
 * Wrapper for https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
 */
export class BlobRequest {
  
  /*
   * Creates a webResource for a PUT request with required headers to upload a block blob.
  */
  public createRequest(accountName:string,containerName:string,blobName: string,requestDate:string,requestSettings:BlobRequestSettings): WebResource {

    // accountName:string, containerName:string, blobName: string, fileSizeBytes:number, requestDate:string, mimeType:string='application/octet-stream', tags:string
    const webResource = new WebResource();





    // HTTP Headers
    webResource.method = 'PUT';
    webResource.url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    webResource.headers.set(HeaderConstants.CONTENT_TYPE, requestSettings.mimeType??"application/octet-stream");
    if(requestSettings.fileSizeBytes) webResource.headers.set(HeaderConstants.CONTENT_LENGTH, requestSettings.fileSizeBytes);
    if(requestSettings.tags) webResource.headers.set(HeaderConstants.X_MS_TAGS, new URLSearchParams(requestSettings.tags).toString());

    // Canonicalized Headers
    webResource.headers.set(HeaderConstants.X_MS_BLOB_TYPE, 'BlockBlob');
    webResource.headers.set(HeaderConstants.X_MS_DATE,requestDate);
    webResource.headers.set(HeaderConstants.X_MS_VERSION,'2021-04-10'); 
    if(requestSettings.metadata) {
      for (const [key, value] of Object.entries(requestSettings.metadata)) {
        webResource.headers.set(HeaderConstants.X_MS_META+key, value);
      }
    }
    

    // Canonicalized Resource
    webResource.headers.set(accountName, `/${accountName}/${containerName}/${blobName}`);
    
    return webResource;
  }

  public createRequestLite(accountName:string, containerName:string, blobName: string, mimeType:string='application/octet-stream'): WebResource {
    const webResource = new WebResource();

    // HTTP Headers
    webResource.method = 'PUT';
    webResource.url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    webResource.headers.set(HeaderConstants.CONTENT_TYPE, mimeType);

    // Canonicalized Headers
    webResource.headers.set(HeaderConstants.X_MS_BLOB_TYPE, 'BlockBlob');
    webResource.headers.set(HeaderConstants.X_MS_DATE, new Date().toUTCString());
    webResource.headers.set(HeaderConstants.X_MS_VERSION,'2021-04-10'); 

    // Canonicalized Resource
    webResource.headers.set(accountName, `/${accountName}/${containerName}/${blobName}`);

    return webResource;
  }


}