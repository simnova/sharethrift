import type { DataSources } from "@sthrift/persistence";

export interface CreateAuthHeaderCommand {
  userId: string;
  fileName: string;
  contentType: string;
  contentLength: number;
}

export interface CreateAuthHeaderResult {
  authHeader: {
    authHeader: string;
    requestDate: string;
    blobPath: string;
    blobName: string;
  };

  status?: {
    success: boolean;
    errorMessage?: string;
  };
}

export const BlobFileSpecs = {
  maxSizeMb: 10,
  permittedContentTypes: ["application/pdf"],
};

export const createAuthHeader = (dataSources: DataSources) => {
  return async (command: CreateAuthHeaderCommand): Promise<CreateAuthHeaderResult> => {
    const { userId, fileName, contentType, contentLength } = command;
    const maxSizeBytes = BlobFileSpecs.maxSizeMb * 1024 * 1024;
    const blobName = `case/identity-verification/${userId}/1.0/${fileName}`;

    return await dataSources.blobDataSource.User.withStorage(async (_passport, blobStorage) => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); //todo need to dlt
      let headerResult: CreateAuthHeaderResult;
      if (contentLength > maxSizeBytes) {
        headerResult = {
          status: {
            success: false,
            errorMessage: "Content length exceeds permitted limit.",
          },
        } as CreateAuthHeaderResult;
      }

      const blobContainerName = "private";
      //   const blobDataStorageAccountName = process.env.STORAGE_ACCOUNT_NAME;
      const blobDataStorageAccountName = "";

      const currentTime = new Date().getTime();
      const blobPath = `https://${blobDataStorageAccountName}.blob.core.windows.net/${blobContainerName}/${blobName}`;
      const requestDate = new Date(currentTime).toUTCString();

      const blobRequestSettings = {
        fileSizeBytes: contentLength,
        mimeType: contentType,
      };
      const authHeader = blobStorage.generateSharedKeyWithOptions(blobName, blobContainerName, requestDate, blobRequestSettings);
      console.log(`authHeader: ${authHeader}`);
      headerResult = {
        status: { success: true },
        authHeader: {
          authHeader: authHeader,
          requestDate: requestDate,
          blobPath,
          blobName,
        },
      };
      return headerResult;
    });
  };
};
