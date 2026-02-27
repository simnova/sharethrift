declare module 'cybersource-rest-client' {
  const cybersourceRestClient: any;
  export default cybersourceRestClient;
  
  export namespace cybersource {
    class ApiClient {
      constructor();
    }
    
    class Configuration {
      authenticationType?: string;
      runEnvironment?: string;
      merchantID?: string;
      merchantKeyId?: string;
      merchantsecretKey?: string;
      logConfiguration?: {
        enableLog?: string;
      };
    }
    
    class MicroformIntegrationApi {
      constructor(config: Configuration, client?: ApiClient);
      generateCaptureContext(req: any, callback: (error: any, data: any) => void): void;
    }
    
    class GenerateCaptureContextRequest {
      targetOrigins?: string[];
      encryptionType?: string;
    }
    
    class PaymentsApi {
      constructor(config: Configuration, client?: ApiClient);
      createPayment(req: any, callback: (error: any, data: any, response: any) => void): void;
    }
    
    class CustomerApi {
      constructor(config: Configuration, client?: ApiClient);
      getCustomer(customerId: string, options: any[], callback: (error: any, data: any, response: any) => void): void;
      patchCustomer(customerId: string, req: any, options: any, callback: (error: any, data: any, response: any) => void): void;
    }
    
    class CustomerPaymentInstrumentApi {
      constructor(config: Configuration, client?: ApiClient);
      getCustomerPaymentInstrument(customerId: string, paymentInstrumentId: string, options: any[], callback: (error: any, data: any, response: any) => void): void;
      getCustomerPaymentInstrumentsList(customerId: string, options: any, callback: (error: any, data: any, response: any) => void): void;
      deleteCustomerPaymentInstrument(customerId: string, paymentInstrumentId: string, options: any, callback: (error: any, data: any, response: any) => void): void;
    }
    
    class PaymentInstrumentApi {
      constructor(config: Configuration, client?: ApiClient);
      patchPaymentInstrument(paymentInstrumentId: string, req: any, options: any, callback: (error: any, data: any, response: any) => void): void;
    }
    
    class RefundApi {
      constructor(config: Configuration, client?: ApiClient);
      refundCapture(req: any, transactionId: string, callback: (error: any, data: any, response: any) => void): void;
    }
    
    class VoidApi {
      constructor(config: Configuration, client?: ApiClient);
      voidCapture(req: any, transactionId: string, callback: (error: any, data: any, response: any) => void): void;
    }
    
    class SearchTransactionsApi {
      constructor(config: Configuration, client?: ApiClient);
      createSearch(req: any, callback: (error: any, data: any, response: any) => void): void;
    }
    
    // Using any for simplicity to avoid complex type definitions
    const CreatePaymentRequest: any;
    const PatchCustomerRequest: any;
    const PatchPaymentInstrumentRequest: any;
    const RefundCaptureRequest: any;
    const VoidCaptureRequest: any;
    const CreateSearchRequest: any;
    const Ptsv2paymentsClientReferenceInformation: any;
    const Ptsv2paymentsOrderInformationAmountDetails: any;
    const Ptsv2paymentsOrderInformationBillTo: any;
    const Ptsv2paymentsOrderInformation: any;
    const Ptsv2paymentsProcessingInformation: any;
    const Ptsv2paymentsTokenInformation: any;
    const Ptsv2paymentsTokenInformationPaymentInstrument: any;
    const Ptsv2paymentsPaymentInformation: any;
    const Ptsv2paymentsPaymentInformationCustomer: any;
    const Ptsv2paymentsPaymentInformationPaymentInstrument: any;
    const Tmsv2customersDefaultPaymentInstrument: any;
    const Tmsv2customersEmbeddedDefaultPaymentInstrumentCard: any;
    const Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo: any;
    const Tmsv2customersEmbeddedDefaultPaymentInstrumentInstrumentIdentifier: any;
  }
}