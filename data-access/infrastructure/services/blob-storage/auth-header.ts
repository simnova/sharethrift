import { HeaderConstants } from './constants';
import { WebResource } from '@azure/storage-blob';
import { URLBuilder } from '@azure/core-http';
import { createHmac } from 'crypto';

export class AuthHeader {

  public generateFromRequestLite(request: WebResource, storageAccount: string, accountKey: string): string {
    const signableString = this.convertToSignableStringLite(request, storageAccount);
    return this.createAuthHeaderLite(storageAccount, signableString, accountKey);
  }

  public createAuthHeaderLite(storageAccount: string, signableString: string, accountKey:string): string {
    console.log(signableString);
    return `SharedKeyLite ${storageAccount}:${this.computeHMACSHA256(signableString, accountKey)}`;
  }

  public convertToSignableStringLite(request: WebResource, accountName: string): string {
    request.headers.set(HeaderConstants.X_MS_DATE, new Date().toUTCString());
    const stringToSign: string =
      [
        request.method.toUpperCase(),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_MD5),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_TYPE),
        this.getHeaderValueToSign(request, HeaderConstants.DATE)
      ].join("\n") +
      "\n" +
      this.getCanonicalizedHeadersString(request) +
      this.getCanonicalizedResourceString(request, accountName);
    return stringToSign;
  }

  public generateFromRequest(request: WebResource, storageAccount: string, accountKey: string): string {
    const signableString = this.convertToSignableString(request, storageAccount);
    return this.createAuthHeader(storageAccount, signableString, accountKey);
  }

  public createAuthHeader(storageAccount: string, signableString: string, accountKey:string): string {
    return `SharedKey ${storageAccount}:${this.computeHMACSHA256(signableString, accountKey)}`;
  }

  public convertToSignableString(request: WebResource, accountName: string): string {
    request.headers.set(HeaderConstants.X_MS_DATE, new Date().toUTCString());
    const stringToSign: string =
      [
        request.method.toUpperCase(),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_ENCODING),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_LANGUAGE),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_LENGTH),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_MD5),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_TYPE),
        this.getHeaderValueToSign(request, HeaderConstants.DATE),
        this.getHeaderValueToSign(request, HeaderConstants.IF_MODIFIED_SINCE),
        this.getHeaderValueToSign(request, HeaderConstants.IF_MATCH),
        this.getHeaderValueToSign(request, HeaderConstants.IF_NONE_MATCH),
        this.getHeaderValueToSign(request, HeaderConstants.IF_UNMODIFIED_SINCE),
        this.getHeaderValueToSign(request, HeaderConstants.RANGE),
      ].join("\n") +
      "\n" +
      this.getCanonicalizedHeadersString(request) +
      this.getCanonicalizedResourceString(request, accountName);
    return stringToSign;
  }

  /**
   * Get URL path from an URL string.
   *
   * @param url - Source URL string
   */
  private getURLPath(url: string): string | undefined {
    const urlParsed = URLBuilder.parse(url);
    return urlParsed.getPath();
  }

  /**
   * To construct the CanonicalizedHeaders portion of the signature string, follow these steps:
   * 1. Retrieve all headers for the resource that begin with x-ms-, including the x-ms-date header.
   * 2. Convert each HTTP header name to lowercase.
   * 3. Sort the headers lexicographically by header name, in ascending order.
   *    Each header may appear only once in the string.
   * 4. Replace any linear whitespace in the header value with a single space.
   * 5. Trim any whitespace around the colon in the header.
   * 6. Finally, append a new-line character to each canonicalized header in the resulting list.
   *    Construct the CanonicalizedHeaders string by concatenating all headers in this list into a single string.
   *
   * @param request -
   */
  private getCanonicalizedHeadersString(request: WebResource): string {
    let headersArray = request.headers.headersArray().filter((value) => {
      return value.name.toLowerCase().startsWith(HeaderConstants.PREFIX_FOR_STORAGE);
    });

    headersArray.sort((a, b): number => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    // Remove duplicate headers
    headersArray = headersArray.filter((value, index, array) => {
      if (index > 0 && value.name.toLowerCase() === array[index - 1].name.toLowerCase()) {
        return false;
      }
      return true;
    });

    let canonicalizedHeadersStringToSign: string = "";
    headersArray.forEach((header) => {
      canonicalizedHeadersStringToSign += `${header.name
        .toLowerCase()
        .trimRight()}:${header.value.trimLeft()}\n`;
    });

    return canonicalizedHeadersStringToSign;
  }

  /**
   * Retrieves the webResource canonicalized resource string.
   *
   * @param request -
   */
  private getCanonicalizedResourceString(request: WebResource, accountName: string): string {
    const path = this.getURLPath(request.url) || "/";

    let canonicalizedResourceString: string = "";
    canonicalizedResourceString += `/${accountName}${path}`;

    const queries = this.getURLQueries(request.url);
    const lowercaseQueries: { [key: string]: string } = {};
    if (queries) {
      const queryKeys: string[] = [];
      for (const key in queries) {
        if (Object.prototype.hasOwnProperty.call(queries, key)) {
          const lowercaseKey = key.toLowerCase();
          lowercaseQueries[lowercaseKey] = queries[key];
          queryKeys.push(lowercaseKey);
        }
      }

      queryKeys.sort();
      for (const key of queryKeys) {
        canonicalizedResourceString += `\n${key}:${decodeURIComponent(lowercaseQueries[key])}`;
      }
    }

    return canonicalizedResourceString;
  }


  /**
   * Retrieve header value according to shared key sign rules.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/authenticate-with-shared-key
   *
   * @param request -
   * @param headerName -
   */

  private getHeaderValueToSign(request: WebResource, headerName: string): string {
    const value = request.headers.get(headerName);

    if (!value) {
      return "";
    }

    // When using version 2015-02-21 or later, if Content-Length is zero, then
    // set the Content-Length part of the StringToSign to an empty string.
    // https://docs.microsoft.com/en-us/rest/api/storageservices/authenticate-with-shared-key
    if (headerName === HeaderConstants.CONTENT_LENGTH && value === "0") {
      return "";
    }

    return value;
  }

  

  /**
 * Generates a hash signature for an HTTP request or for a SAS.
 *
 * @param stringToSign -
 */
  public computeHMACSHA256(stringToSign: string, accountKey: string): string {
    const utf8encoded = Buffer.from(accountKey, 'base64');
    return createHmac('sha256', utf8encoded).update(stringToSign).digest("base64");
  }

  /**
 * Get URL query key value pairs from an URL string.
 *
 * @param url -
 */
  private getURLQueries(url: string): { [key: string]: string } {
    let queryString = URLBuilder.parse(url).getQuery();
    if (!queryString) {
      return {};
    }

    queryString = queryString.trim();
    queryString = queryString.startsWith("?") ? queryString.substr(1) : queryString;

    let querySubStrings: string[] = queryString.split("&");
    querySubStrings = querySubStrings.filter((value: string) => {
      const indexOfEqual = value.indexOf("=");
      const lastIndexOfEqual = value.lastIndexOf("=");
      return (
        indexOfEqual > 0 && indexOfEqual === lastIndexOfEqual && lastIndexOfEqual < value.length - 1
      );
    });

    const queries: { [key: string]: string } = {};
    for (const querySubString of querySubStrings) {
      const splitResults = querySubString.split("=");
      const key: string = splitResults[0];
      const value: string = splitResults[1];
      queries[key] = value;
    }

    return queries;
  }

}