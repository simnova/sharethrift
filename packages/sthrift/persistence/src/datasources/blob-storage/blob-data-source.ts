// import { ServiceBlobStorage } from "@sthrift/service-blob-storage";
// import type { BlobStorageBase } from "@sthrift/service-blob-storage";

// export class BlobDataSourceImpl {
//   private readonly blobStorage: ServiceBlobStorage;
//   constructor() {
//     this.blobStorage = new ServiceBlobStorage();
//   }

//   private async withStorage(func: (blobStorage: BlobStorageBase) => Promise<void>): Promise<void> {
//     const blobStorage = this.blobStorage as BlobStorageBase;
//     await func(blobStorage);
//   }

// //   private getBlobAuthHeader(userId: string, fileName: string, contentType: string, contentLength: number): any {
// //     console.log("getBlogAuthHeader", userId, fileName, contentType, contentLength);
// //   }

// //   private async getHeader(
// //     caseId: string,
// //     permittedContentTypes: string[],
// //     contentType: string,
// //     contentLength: number,
// //     maxSizeBytes: number,
// //     blobName: string
// //   ) {
// //     let headerResult: any; //IdentityVerificationCaseV1BlobContentAuthHeaderResult;
// //     await this.withStorage(async (blobStorage) => {
// //       if (!permittedContentTypes.includes(contentType)) {
// //         headerResult = {
// //           status: {
// //             success: false,
// //             errorMessage: "Content type not permitted.",
// //           },
// //         } as any; //IdentityVerificationCaseV1BlobContentAuthHeaderResult;
// //         return;
// //       }
// //       if (contentLength > maxSizeBytes) {
// //         headerResult = {
// //           status: {
// //             success: false,
// //             errorMessage: "Content length exceeds permitted limit.",
// //           },
// //         } as any; //IdentityVerificationCaseV1BlobContentAuthHeaderResult;
// //         return;
// //       }

// //       const indexFields: Record<string, string> = {
// //         caseId: caseId,
// //         transmissionStatus: "pending", //always pending when uploading
// //         documentVersion: "current",
// //         createdDate: new Date().toISOString(),
// //       };

// //       const blobContainerName = "private";
// //       const blobDataStorageAccountName = process.env["STORAGE_ACCOUNT_NAME"];

// //       const currentTime = new Date().getTime();
// //       const blobPath = `https://${blobDataStorageAccountName}.blob.core.windows.net/${blobContainerName}/${blobName}`;
// //       const requestDate = new Date(currentTime).toUTCString();

// //       const blobRequestSettings: any = {
// //         fileSizeBytes: contentLength,
// //         mimeType: contentType,
// //         tags: indexFields,
// //       };

// //       const authHeader = blobStorage.generateSharedKeyWithOptions(blobName, blobContainerName, requestDate, blobRequestSettings);
// //       console.log(`authHeader: ${authHeader}`);
// //       headerResult = {
// //         status: { success: true },
// //         authHeader: {
// //           authHeader: authHeader,
// //           requestDate: requestDate,
// //           blobPath,
// //           blobName,
// //         },
// //       } as any; //IdentityVerificationCaseV1BlobContentAuthHeaderResult;
// //     });
// //     return headerResult;
// //   }
// }

