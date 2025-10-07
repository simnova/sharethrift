// @ts-nocheck 
// TODO need to write test cases and fix types
import type { BlobRequestSettings } from './interface.ts';
import { AzBlobStorage } from './index.ts';

const performIntegrationTests = true;

const accountName = performIntegrationTests ? process.env.STORAGE_ACCOUNT_NAME : 'account-name';
const accountKey = performIntegrationTests ? process.env.STORAGE_ACCOUNT_KEY : 'account-key';

describe('When using the Blob Storage API', () => {
  let blobStorage: AzBlobStorage;
  beforeEach(() => {
    blobStorage = new AzBlobStorage(accountName, accountKey);
  });

  test.skip('create auth header for text file', () => {
    // arrange
    const blobName = 'owners2.simnova.com';
    const containerName = 'community-domains';
    const fileSizeBytes = 42;
    const requestDate: Date = new Date();

    const requestDateString = requestDate.toUTCString();

    const tags: Record<string, string> = {
      owner: 'foo',
      community: 'bar',
      dateCreated: requestDate.toISOString(),
    };

    const metadata: Record<string, string> = {
      original_file_name: 'text-file.txt',
      uploaded_by: 'jane doe',
    };

    const requestSettings: BlobRequestSettings = {
      fileSizeBytes: fileSizeBytes,
      mimeType: 'text/plain',
      tags: tags,
      metadata: metadata,
    };

    // act
    const sharedKey = blobStorage.generateSharedKeyWithOptions(blobName, containerName, requestDateString, requestSettings);
    // console.log(sharedKey);

    // assert
    expect(sharedKey).toMatch(RegExp(`^SharedKey ${accountName}:[A-Za-z0-9+/=]+$`));
  });

  test.skip('list blobs by path', async () => {
    // arrange
    const containerName = 'community-domains';
    const _path = '/';
    // act
    const blobs = await blobStorage.listBlobs(containerName, 'owners2');
    // assert
    expect(blobs.length).toBeGreaterThan(0);
  });

  test.skip('find blobs by tags', async () => {
    // arrange
    const searchCriteria = "@container = 'community-domains' AND owner = 'foo' AND community = 'bar' AND dateCreated > '2021-01-01T00:00:00.000Z'";
    // act
    const blobs = await blobStorage.findBlobsByTags(searchCriteria);
    // assert
    expect(blobs.length).toBeGreaterThan(0);
  });

  test.skip('create text blob', async () => {
    // arrange
    const containerName = 'community-domains';
    const blobName = 'test.txt';
    const content = 'Hello World!';
    // act
    await blobStorage.createTextBlob(blobName, containerName, content);
    // assert
    expect(true).toBe(true);
  });

  test.skip('create json blob', async () => {
    // arrange
    const containerName = 'community-domains';
    const blobName = 'test.json';
    const content = JSON.stringify({ foo: 'bar' });
    // act
    await blobStorage.createTextBlob(blobName, containerName, content, 'application/json');
    // assert
    expect(true).toBe(true);
  });
});

test.skip('blob-storage: create auth header for zip file', () => {
  // arrange
  const blobStorage = new AzBlobStorage('', '');
  const blobName = 'MicrosoftFluentWeb_2004.zip';
  const fileSizeBytes = 15487837;
  const requestDate = new Date().toUTCString();

  // act
  const sharedKey = blobStorage.generateSharedKey(blobName, fileSizeBytes, requestDate, 'application/zip', 'test-container');
  // assert
  expect(sharedKey).toBe('SharedKey test:Zm9vYmFy'); // expect test to fail - but helpful to see actual output
});

test.skip('blob-storage: create auth header for text file', () => {
  // arrange
  const blobStorage = new AzBlobStorage('', '');
  const blobName = 'test4.txt';
  const fileSizeBytes = 14;
  const requestDate = new Date().toUTCString();

  // act
  const sharedKey = blobStorage.generateSharedKey(blobName, fileSizeBytes, requestDate, 'text/plain', 'test-container');
  // assert
  expect(sharedKey).toBe('SharedKey test:Zm9vYmFy');
});

test.skip('blob-storage: create auth header lite for zip file', () => {
  // arrange
  const blobStorage = new AzBlobStorage('', '');
  const blobName = 'test.txt';
  // act
  const sharedKeyLite = blobStorage.generateSharedKeyLite(blobName, 'text/plain', 'test-container');
  // assert
  expect(sharedKeyLite).toBe('SharedKeyLite test:Zm9vYmFy');
});
