import { BlobStorage } from './index';


test('blob-storage: create auth header for zip file', () => {
  
  // arrange
  const blobStorage = new BlobStorage();
  const blobName = 'MicrosoftFluentWeb_2004.zip';
  const fileSizeBytes = 15487837;
  const requestDate = new Date().toUTCString();
  
  // act
  var sharedKey = blobStorage.generateSharedKey(blobName, fileSizeBytes,requestDate, 'application/zip');
  // assert
  expect(sharedKey).toBe('SharedKey test:Zm9vYmFy'); // expect test to fail - but helpul to see actual ouput
  
});

test.skip('blob-storage: create auth header for text file', () => {
  
  // arrange
  const blobStorage = new BlobStorage();
  const blobName = 'test4.txt';
  const fileSizeBytes = 14;
  const requestDate = new Date().toUTCString();
  
  // act
  var sharedKey = blobStorage.generateSharedKey(blobName, fileSizeBytes,requestDate, 'text/plain');
  // assert
  expect(sharedKey).toBe('SharedKey test:Zm9vYmFy');
  
});

test.skip('blob-storage: create auth header lite for zip file', () => {
  
  // arrange
  const blobStorage = new BlobStorage();
  const blobName = 'test.txt';
  // act
  var sharedKeyLite = blobStorage.generateSharedKeyLite(blobName, 'text/plain');
  // assert
  expect(sharedKeyLite).toBe('SharedKeyLite test:Zm9vYmFy');
  
});