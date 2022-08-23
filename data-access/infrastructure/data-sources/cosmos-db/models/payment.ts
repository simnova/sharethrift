export interface LoadPaymentPageRes {
  keyId: string;
  transactionId: string;
}

export interface ProcessCybersourcePaymentResponse {
  transactionId: string;
  reconciliationId: string;
  status: string;
  responseCode: string;
  submittedTimeUtc: string;
  requestId: string;
}

export interface ProcessCybersourceRefundResponse {
  nothing: string;
}

export interface ProcessPaypalAuthTokenResponse {
  respMsg: string;
  result: string;
  secureToken: string;
  secureTokenId: string;
}