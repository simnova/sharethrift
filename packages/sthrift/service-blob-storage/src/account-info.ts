export class AccountInfo {
  private static instance: AccountInfo;
  private readonly blobAccountNameEnvKey = 'STORAGE_ACCOUNT_NAME';
  private readonly blobAccountKeyEnvKey = 'STORAGE_ACCOUNT_KEY';

  private readonly accountName: string;
  private readonly accountKey: string;

  private constructor() {
    this.accountName = this.tryGetEnvVar(this.blobAccountNameEnvKey);
    this.accountKey = this.tryGetEnvVar(this.blobAccountKeyEnvKey);
  }

  public getSettings()  {
    return {
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