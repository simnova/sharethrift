export interface b2cRequestBody {
  oid: string,
  lang: string
}

export interface conflictError {
  version: string;
  status: number;
  userMessage: string;
}