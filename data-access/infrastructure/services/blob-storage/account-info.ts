export class AccountInfo {
  private static instance: AccountInfo;
  private readonly blobContainerNameEnvKey = 'BLOB_CONTAINER_NAME';
  private readonly blobAccountNameEnvKey = 'BLOB_ACCOUNT_NAME';
  private readonly blobAccountKeyEnvKey = 'BLOB_ACCOUNT_KEY';

  private readonly containerName: string;
  private readonly accountName: string;
  private readonly accountKey: string;

  private constructor() {
    this.containerName = this.tryGetEnvVar(this.blobContainerNameEnvKey);
    this.accountName = this.tryGetEnvVar(this.blobAccountNameEnvKey);
    this.accountKey = this.tryGetEnvVar(this.blobAccountKeyEnvKey);
  }

  public getSettings()  {
    return {
      containerName: this.containerName,
      accountName: this.accountName,
      accountKey: this.accountKey
    }
  }

  static getInstance(): AccountInfo {
    if (!AccountInfo.instance) {
      AccountInfo.instance = new AccountInfo();
    }
    return AccountInfo.instance;
  }
  
  private tryGetEnvVar = (envVar:string):string =>{
    const value = process.env[envVar];
    if(value === undefined){
      throw new Error(`Environment variable: ${envVar} is not set`);
    }
    return value;
  }

}