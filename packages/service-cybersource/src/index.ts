import type { ServiceBase } from "@cellix/api-services-spec";
import type {
  CybersourceBase,
  CustomerProfile,
  PaymentTokenInfo,
  PaymentTransactionResponse,
  CustomerPaymentResponse,
  CustomerPaymentInstrumentResponse,
  PaymentInstrumentInfo,
  TransactionReceipt,
  CustomerPaymentInstrumentsResponse,
  PlanCreation,
  PlanCreationResponse,
  PlanResponse,
  Subscription,
  SubscriptionResponse,
  SubscriptionsListResponse,
  SuspendSubscriptionResponse
} from "./cybersource-interface.js";
import axios from "axios";
import type { AxiosInstance } from "axios";

export class ServiceCybersource
  implements ServiceBase<ServiceCybersource>, CybersourceBase
{
  private client: AxiosInstance | undefined;
  private baseUrl: string;

  constructor(baseUrl: string = process.env["PAYMENT_API_URL"]!) {
    this.baseUrl = baseUrl;
  }

  public async startUp(): Promise<
    Exclude<ServiceCybersource, ServiceBase<ServiceCybersource>>
  > {
    if (this.client) throw new Error("ServiceCybersource is already started");
    this.client = axios.create({ baseURL: this.baseUrl });
    return this as Exclude<ServiceCybersource, ServiceBase<ServiceCybersource>>;
  }

  public async shutDown(): Promise<void> {
    this.client = undefined;
  }

  //   ========== This code will get deleted ===========
  public get service(): AxiosInstance {
    if (!this.client)
      throw new Error(
        "ServiceCybersource is not started - cannot access service"
      );
    return this.client;
  }

  public async createPayment(req: unknown): Promise<unknown> {
    const { data } = await this.service.post("/pts/v2/payments", req);
    return data;
  }

  public async refundPayment(req: unknown): Promise<unknown> {
    const { data } = await this.service.post("/pts/v2/refunds", req);
    return data;
  }
  //   ========== This code will get deleted ===========

  async generatePublicKey(): Promise<string> {
    // Mock implementation, return a dummy public key
    return "MOCK_PUBLIC_KEY_1234567890";
  }

  async createCustomerProfile(
    customerProfile: CustomerProfile,
    paymentTokenInfo: PaymentTokenInfo
  ): Promise<PaymentTransactionResponse> {
    console.log(
      "Mock createCustomerProfile called with:",
      customerProfile,
      paymentTokenInfo
    );
    // Mock implementation, return a dummy response
    return {
      _links: {
        self: {
          href: "https://api.mockcybersource.com/customers/MOCK_CUSTOMER_ID_123456",
          method: "GET",
        },
        capture: {
          href: "https://api.mockcybersource.com/customers/MOCK_CUSTOMER_ID_123456/capture",
          method: "POST",
        },
      },
      id: "MOCK_CUSTOMER_ID_123456",
      submitTimeUtc: new Date().toISOString(),
      status: "AUTHORIZED",
      reason: "NONE",
      reconciliationId: "MOCK_RECONCILIATION_7890",
      clientReferenceInformation: { code: "REF-MOCK-123" },
      processorInformation: {
        approvalCode: "APPROVED123",
        responseCode: "100",
        avs: { code: "Y", codeRaw: "Y" },
        cardVerification: { resultCode: "M" },
        paymentAccountReferenceNumber: "PAR123456789",
        transactionId: "TXN-MOCK-456789",
        networkTransactionId: "NTXN-MOCK-987654",
      },
      paymentAccountInformation: {
        card: { type: "001" },
      },
      paymentInformation: {
        card: { type: "001" },
        tokenizedCard: { type: "001" },
        paymentInstrument: { id: "MOCK_PAYINSTRUMENT_111" },
        instrumentIdentifier: { id: "MOCK_INSTRUMENT_222", state: "ACTIVE" },
        accountFeatures: { balanceAmount: "0.00" },
        customer: { id: "MOCK_CUSTOMER_ID_123456" },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "0.00",
          authorizedAmount: "0.00",
          currency: "USD",
        },
      },
      pointOfSaleInformation: { terminalId: "MOCK_TERMINAL_01" },
      tokenInformation: {
        instrumentidentifierNew: true,
        paymentInstrument: { id: "MOCK_PAYINSTRUMENT_111" },
        instrumentIdentifier: { id: "MOCK_INSTRUMENT_222", state: "ACTIVE" },
        customer: { id: "MOCK_CUSTOMER_ID_123456" },
      },
      voidAmountDetails: {
        voidAmount: "0.00",
        currency: "USD",
      },
    };
  }

  async getCustomerProfile(
    customerId: string
  ): Promise<CustomerPaymentResponse> {
    // Mock implementation, return a dummy response
    console.log("Mock getCustomerProfile called with:", customerId);
    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${customerId}`,
        },
        paymentInstruments: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
        },
      },
      id: customerId,
      clientReferenceInformation: { code: "MOCK-REF-001" },
      defaultPaymentInstrument: { id: "MOCK_PAYMENT_INSTRUMENT_1" },
      metadata: { creator: "mock_service" },
      _embedded: {
        defaultPaymentInstrument: {
          _links: {
            self: {
              href: `https://api.mockcybersource.com/payment-instruments/MOCK_PAYMENT_INSTRUMENT_1`,
            },
            customer: {
              href: `https://api.mockcybersource.com/customers/${customerId}`,
            },
          },
          id: "MOCK_PAYMENT_INSTRUMENT_1",
          object: "paymentInstrument",
          default: true,
          state: "ACTIVE",
          card: {
            expirationMonth: "12",
            expirationYear: "2025",
            type: "001", // Visa
          },
          buyerInformation: {
            currency: "USD",
          },
          billTo: {
            firstName: "John",
            lastName: "Doe",
            address1: "123 Mock Street",
            address2: "",
            locality: "Mock City",
            administrativeArea: "CA",
            postalCode: "90001",
            country: "US",
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
          },
          processingInformation: {
            billPaymentProgramEnabled: false,
          },
          instrumentIdentifier: {
            id: "MOCK_INSTRUMENT_123",
          },
          metadata: {
            creator: "mock_service",
          },
          _embedded: {
            instrumentIdentifier: {
              _links: {
                self: {
                  href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_INSTRUMENT_123`,
                },
                paymentInstruments: {
                  href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_INSTRUMENT_123/payment-instruments`,
                },
              },
              id: "MOCK_INSTRUMENT_123",
              object: "instrumentIdentifier",
              state: "ACTIVE",
              card: {
                number: "411111XXXXXX1111",
              },
              processingInformation: {
                authorizationOptions: {
                  initiator: {
                    merchantInitiatedTransaction: {
                      previousTransactionId: "TXN-MOCK-111",
                    },
                  },
                },
              },
              metadata: {
                creator: "mock_service",
              },
            },
          },
        },
      },
    };
  }

  async addCustomerPaymentInstrument(
    customerProfile: CustomerProfile,
    paymentTokenInfo: PaymentTokenInfo
  ): Promise<PaymentTransactionResponse> {
    console.log(
      "Mock addCustomerPaymentInstrument called with:",
      customerProfile,
      paymentTokenInfo
    );
    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${
            customerProfile.customerId ?? "MOCK_CUSTOMER"
          }/payment-instruments/MOCK_INSTRUMENT_456`,
          method: "GET",
        },
        capture: {
          href: `https://api.mockcybersource.com/customers/${
            customerProfile.customerId ?? "MOCK_CUSTOMER"
          }/payment-instruments/MOCK_INSTRUMENT_456/capture`,
          method: "POST",
        },
      },
      id: "MOCK_INSTRUMENT_456",
      submitTimeUtc: new Date().toISOString(),
      status: "AUTHORIZED",
      reason: "NONE",
      reconciliationId: "MOCK_RECONCILIATION_2222",
      clientReferenceInformation: { code: "REF-MOCK-INSTRUMENT" },
      processorInformation: {
        approvalCode: "APPROVED456",
        responseCode: "100",
        avs: { code: "Y", codeRaw: "Y" },
        cardVerification: { resultCode: "M" },
        paymentAccountReferenceNumber: "PAR-MOCK-456",
        transactionId: "TXN-MOCK-2222",
        networkTransactionId: "NTXN-MOCK-2222",
      },
      paymentAccountInformation: {
        card: { type: "002" }, // MasterCard
      },
      paymentInformation: {
        card: { type: "002" },
        tokenizedCard: { type: "002" },
        paymentInstrument: { id: "MOCK_INSTRUMENT_456" },
        instrumentIdentifier: { id: "MOCK_IDENTIFIER_456", state: "ACTIVE" },
        accountFeatures: { balanceAmount: "0.00" },
        customer: { id: customerProfile.customerId ?? "MOCK_CUSTOMER" },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "0.00",
          authorizedAmount: "0.00",
          currency: "USD",
        },
      },
      pointOfSaleInformation: {
        terminalId: "MOCK_TERMINAL_02",
      },
      tokenInformation: {
        instrumentidentifierNew: true,
        paymentInstrument: { id: "MOCK_INSTRUMENT_456" },
        instrumentIdentifier: { id: "MOCK_IDENTIFIER_456", state: "ACTIVE" },
        customer: { id: customerProfile.customerId ?? "MOCK_CUSTOMER" },
      },
      voidAmountDetails: {
        voidAmount: "0.00",
        currency: "USD",
      },
    };
  }

  async getCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CustomerPaymentInstrumentResponse> {
    console.log(
      "Mock getCustomerPaymentInstrument called with:",
      customerId,
      paymentInstrumentId
    );
    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/PI_1111`,
        },
        customer: {
          href: `https://api.mockcybersource.com/customers/${customerId}`,
        },
      },
      id: "PI_1111",
      object: "paymentInstrument",
      default: true,
      state: "ACTIVE",
      card: {
        expirationMonth: "12",
        expirationYear: "2026",
        type: "001", // Visa
      },
      buyerInformation: { currency: "USD" },
      billTo: {
        firstName: "John",
        lastName: "Doe",
        address1: "123 Mock Street",
        address2: "",
        locality: "Faketown",
        administrativeArea: "CA",
        postalCode: "99999",
        country: "US",
        email: "john.doe@example.com",
        phoneNumber: "+1-555-1234",
      },
      processingInformation: { billPaymentProgramEnabled: false },
      instrumentIdentifier: { id: "MOCK_IDENTIFIER_1111" },
      metadata: { creator: "mock_system" },
      _embedded: {
        instrumentIdentifier: {
          _links: {
            self: {
              href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_IDENTIFIER_1111`,
            },
            paymentInstruments: {
              href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
            },
          },
          id: "MOCK_IDENTIFIER_1111",
          object: "instrumentIdentifier",
          state: "ACTIVE",
          card: { number: "411111XXXXXX1111" },
          processingInformation: {
            authorizationOptions: {
              initiator: {
                merchantInitiatedTransaction: {
                  previousTransactionId: "TXN12345",
                },
              },
            },
          },
          metadata: { creator: "mock_system" },
        },
      },
    };
  }

  async getCustomerPaymentInstruments(
    customerId: string,
    offset: number = 0,
    limit: number = 10
  ): Promise<CustomerPaymentInstrumentsResponse> {
    console.log(
      "Mock getCustomerPaymentInstruments called with:",
      customerId,
      offset,
      limit
    );
    const paymentInstruments = [
      {
        _links: {
          self: {
            href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/PI_1111`,
          },
          customer: {
            href: `https://api.mockcybersource.com/customers/${customerId}`,
          },
        },
        id: "PI_1111",
        object: "paymentInstrument",
        default: true,
        state: "ACTIVE",
        card: {
          expirationMonth: "12",
          expirationYear: "2026",
          type: "001", // Visa
        },
        buyerInformation: { currency: "USD" },
        billTo: {
          firstName: "John",
          lastName: "Doe",
          address1: "123 Mock Street",
          address2: "",
          locality: "Faketown",
          administrativeArea: "CA",
          postalCode: "99999",
          country: "US",
          email: "john.doe@example.com",
          phoneNumber: "+1-555-1234",
        },
        processingInformation: { billPaymentProgramEnabled: false },
        instrumentIdentifier: { id: "MOCK_IDENTIFIER_1111" },
        metadata: { creator: "mock_system" },
        _embedded: {
          instrumentIdentifier: {
            _links: {
              self: {
                href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_IDENTIFIER_1111`,
              },
              paymentInstruments: {
                href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
              },
            },
            id: "MOCK_IDENTIFIER_1111",
            object: "instrumentIdentifier",
            state: "ACTIVE",
            card: { number: "411111XXXXXX1111" },
            processingInformation: {
              authorizationOptions: {
                initiator: {
                  merchantInitiatedTransaction: {
                    previousTransactionId: "TXN12345",
                  },
                },
              },
            },
            metadata: { creator: "mock_system" },
          },
        },
      },
    ];

    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
        },
        first: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments?offset=0&limit=${limit}`,
        },
        last: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments?offset=0&limit=${limit}`,
        },
      },
      offset,
      limit,
      count: paymentInstruments.length,
      total: paymentInstruments.length,
      _embedded: {
        paymentInstruments: paymentInstruments.slice(offset, offset + limit),
      },
    };
  }

  async deleteCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<boolean> {
    // In real API, we’d check if the instrument exists and delete it.
    console.log(
      "Mock deleteCustomerPaymentInstrument called with:",
      customerId,
      paymentInstrumentId
    );
    return true;
  }

  async setDefaultCustomerPaymentInstrument(
    customerId: string,
    paymentInstrumentId: string
  ): Promise<CustomerPaymentResponse> {
    console.log(
      "Mock setDefaultCustomerPaymentInstrument called with:",
      customerId,
      paymentInstrumentId
    );
    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${customerId}`,
        },
        paymentInstruments: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
        },
      },
      id: customerId,
      clientReferenceInformation: {
        code: `SET_DEFAULT_${paymentInstrumentId}`,
      },
      defaultPaymentInstrument: {
        id: paymentInstrumentId,
      },
      metadata: {
        creator: "mock-service",
      },
      _embedded: {
        defaultPaymentInstrument: {
          _links: {
            self: {
              href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
            },
            customer: {
              href: `https://api.mockcybersource.com/customers/${customerId}`,
            },
          },
          id: paymentInstrumentId,
          object: "paymentInstrument",
          default: true,
          state: "ACTIVE",
          card: {
            expirationMonth: "12",
            expirationYear: "2026",
            type: "001", // Visa
          },
          buyerInformation: {
            currency: "USD",
          },
          billTo: {
            firstName: "John",
            lastName: "Doe",
            address1: "123 Mock Street",
            address2: "Unit 4",
            locality: "Faketown",
            administrativeArea: "CA",
            postalCode: "99999",
            country: "US",
            email: "john.doe@example.com",
            phoneNumber: "555-123-4567",
          },
          processingInformation: {
            billPaymentProgramEnabled: false,
          },
          instrumentIdentifier: {
            id: "MOCK_IDENTIFIER_DEFAULT",
          },
          metadata: {
            creator: "mock-service",
          },
          _embedded: {
            instrumentIdentifier: {
              _links: {
                self: {
                  href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_DEFAULT`,
                },
                paymentInstruments: {
                  href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_DEFAULT/payment-instruments`,
                },
              },
              id: "MOCK_IDENTIFIER_DEFAULT",
              object: "instrumentIdentifier",
              state: "ACTIVE",
              card: {
                number: "411111XXXXXX1111",
              },
              processingInformation: {
                authorizationOptions: {
                  initiator: {
                    merchantInitiatedTransaction: {
                      previousTransactionId: "TXN123456789",
                    },
                  },
                },
              },
              metadata: {
                creator: "mock-service",
              },
            },
          },
        },
      },
    };
  }

  async updateCustomerPaymentInstrument(
    customerProfile: CustomerProfile,
    paymentInstrumentInfo: PaymentInstrumentInfo
  ): Promise<CustomerPaymentInstrumentResponse> {
    console.log(
      "Mock updateCustomerPaymentInstrument called with:",
      customerProfile,
      paymentInstrumentInfo
    );
    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${customerProfile.customerId}/payment-instruments/${paymentInstrumentInfo.paymentInstrumentId}`,
        },
        customer: {
          href: `https://api.mockcybersource.com/customers/${customerProfile.customerId}`,
        },
      },
      id: paymentInstrumentInfo.paymentInstrumentId,
      object: "paymentInstrument",
      default: paymentInstrumentInfo.id === "DEFAULT" ? true : false,
      state: "ACTIVE",
      card: {
        expirationMonth: paymentInstrumentInfo.cardExpirationMonth,
        expirationYear: paymentInstrumentInfo.cardExpirationYear,
        type: paymentInstrumentInfo.cardType, // e.g., "001" Visa
      },
      buyerInformation: {
        currency: "USD",
      },
      billTo: {
        firstName: customerProfile.billingFirstName,
        lastName: customerProfile.billingLastName,
        address1: customerProfile.billingAddressLine1,
        address2: customerProfile.billingAddressLine2 || "",
        locality: customerProfile.billingCity,
        administrativeArea: customerProfile.billingState,
        postalCode: customerProfile.billingPostalCode,
        country: customerProfile.billingCountry,
        email: customerProfile.billingEmail,
        phoneNumber: customerProfile.billingPhone || "",
      },
      processingInformation: {
        billPaymentProgramEnabled: false,
      },
      instrumentIdentifier: {
        id: `MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}`,
      },
      metadata: {
        creator: "mock-service",
      },
      _embedded: {
        instrumentIdentifier: {
          _links: {
            self: {
              href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}`,
            },
            paymentInstruments: {
              href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}/payment-instruments`,
            },
          },
          id: `MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}`,
          object: "instrumentIdentifier",
          state: "ACTIVE",
          card: {
            number: "411111XXXXXX1111",
          },
          processingInformation: {
            authorizationOptions: {
              initiator: {
                merchantInitiatedTransaction: {
                  previousTransactionId: "TXN_UPDATED_12345",
                },
              },
            },
          },
          metadata: {
            creator: "mock-service",
          },
        },
      },
    };
  }

  async processPayment(
    clientReferenceCode: string,
    paymentInstrumentId: string,
    amount: number
  ): Promise<TransactionReceipt> {
    console.log(
      "Mock processPayment called with:",
      clientReferenceCode,
      paymentInstrumentId,
      amount
    );
    // Simple mock rule: decline if amount > 1000
    if (amount > 1000) {
      return {
        isSuccess: false,
        vendor: "MockCybersource",
        errorOccurredAt: new Date(),
        amount,
        transactionId: `TXN_FAIL_${Date.now()}`,
        reconciliationId: `RECON_FAIL_${Date.now()}`,
        errorCode: "LIMIT_EXCEEDED",
        errorMessage: "Mock: Transactions over 1000 are declined.",
      };
    }

    return {
      isSuccess: true,
      vendor: "MockCybersource",
      completedAt: new Date(),
      amount,
      transactionId: `TXN_${Date.now()}`,
      reconciliationId: `RECON_${Date.now()}`,
    };
  }

  async processRefund(
    transactionId: string,
    amount: number,
    referenceId: string
  ): Promise<TransactionReceipt> {
    console.log(
      "Mock processRefund called with:",
      transactionId,
      amount,
      referenceId
    );
    // Mock rule: if amount is 0 or negative, fail
    if (amount <= 0) {
      return {
        isSuccess: false,
        vendor: "MockCybersource",
        errorOccurredAt: new Date(),
        amount,
        transactionId: `REFUND_FAIL_${Date.now()}`,
        reconciliationId: `RECON_REFUND_FAIL_${Date.now()}`,
        errorCode: "INVALID_AMOUNT",
        errorMessage: "Mock: Refund amount must be greater than zero.",
      };
    }

    // Mock rule: if transactionId looks invalid, fail
    if (!transactionId.startsWith("TXN_")) {
      return {
        isSuccess: false,
        vendor: "MockCybersource",
        errorOccurredAt: new Date(),
        amount,
        transactionId: `REFUND_FAIL_${Date.now()}`,
        reconciliationId: `RECON_REFUND_FAIL_${Date.now()}`,
        errorCode: "INVALID_TRANSACTION",
        errorMessage: `Mock: Transaction ${transactionId} not found.`,
      };
    }

    // Otherwise pretend refund succeeded
    return {
      isSuccess: true,
      vendor: "MockCybersource",
      completedAt: new Date(),
      amount,
      transactionId: `REFUND_${Date.now()}`,
      reconciliationId: `RECON_REFUND_${Date.now()}`,
    };
  }

  async voidPayment(
    clientReferenceCode: string,
    transactionId: string
  ): Promise<PaymentTransactionResponse> {
    console.log(
      "Mock voidPayment called with:",
      clientReferenceCode,
      transactionId
    );
    // Mock rule: transactionId must start with TXN_
    if (!transactionId.startsWith("TXN_")) {
      return {
        _links: {
          self: {
            href: `https://api.mockcybersource.com/payments/${transactionId}`,
            method: "GET",
          },
          capture: {
            href: `https://api.mockcybersource.com/payments/${transactionId}`,
            method: "POST",
          },
        },
        id: transactionId,
        submitTimeUtc: new Date().toISOString(),
        status: "ERROR",
        reason: "INVALID_TRANSACTION",
        reconciliationId: `RECON_VOID_FAIL_${Date.now()}`,
        clientReferenceInformation: { code: clientReferenceCode },
        processorInformation: {
          approvalCode: "",
          responseCode: "404",
          avs: { code: "", codeRaw: "" },
          cardVerification: { resultCode: "" },
          paymentAccountReferenceNumber: "",
          transactionId,
          networkTransactionId: "",
        },
        paymentAccountInformation: { card: { type: "001" } },
        paymentInformation: {
          card: { type: "001" },
          tokenizedCard: { type: "TOKEN_123456" },
          paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
          instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
          accountFeatures: { balanceAmount: "1000" },
          customer: { id: "MOCK_CUSTOMER_1" },
        },
        orderInformation: {
          amountDetails: {
            totalAmount: "100",
            authorizedAmount: "100",
            currency: "USD",
          },
        },
        pointOfSaleInformation: { terminalId: "POS_1" },
        tokenInformation: {
          instrumentidentifierNew: false,
          paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
          instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
          customer: { id: "MOCK_CUSTOMER_1" },
        },
        voidAmountDetails: { voidAmount: "100", currency: "USD" },
      };
    }

    // Otherwise, return a successful void response
    return {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/payments/${transactionId}`,
          method: "GET",
        },
        capture: {
          href: `https://api.mockcybersource.com/payments/${transactionId}`,
          method: "POST",
        },
      },
      id: transactionId,
      submitTimeUtc: new Date().toISOString(),
      status: "VOIDED",
      reason: "VOIDED_BY_MOCK",
      reconciliationId: `RECON_VOID_${Date.now()}`,
      clientReferenceInformation: { code: clientReferenceCode },
      processorInformation: {
        approvalCode: "APPROVED",
        responseCode: "200",
        avs: { code: "Y", codeRaw: "Y" },
        cardVerification: { resultCode: "M" },
        paymentAccountReferenceNumber: "REF_123456",
        transactionId,
        networkTransactionId: `NET_${Date.now()}`,
      },
      paymentAccountInformation: { card: { type: "001" } },
      paymentInformation: {
        card: { type: "001" },
        tokenizedCard: { type: "TOKEN_123456" },
        paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
        instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
        accountFeatures: { balanceAmount: "1000" },
        customer: { id: "MOCK_CUSTOMER_1" },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "100",
          authorizedAmount: "100",
          currency: "USD",
        },
      },
      pointOfSaleInformation: { terminalId: "POS_1" },
      tokenInformation: {
        instrumentidentifierNew: false,
        paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
        instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
        customer: { id: "MOCK_CUSTOMER_1" },
      },
      voidAmountDetails: { voidAmount: "100", currency: "USD" },
    };
  }

  async getSuccessOrLatestFailedTransactionsByReferenceId(
    referenceId: string
  ): Promise<TransactionReceipt> {
    console.log(
      "Mock getSuccessOrLatestFailedTransactionsByReferenceId called with:",
      referenceId
    );
    // Mock logic: randomly return success or failed transaction
    const isSuccess = Math.random() > 0.3; // 70% chance success
    const now = new Date();

    if (isSuccess) {
      return {
        isSuccess: true,
        vendor: "MOCK_CYBERSOURCE",
        completedAt: now,
        amount: 100, // mock amount
        transactionId: `TXN_${referenceId}_${Date.now()}`,
        reconciliationId: `RECON_${referenceId}_${Date.now()}`,
      };
    } else {
      return {
        isSuccess: false,
        vendor: "MOCK_CYBERSOURCE",
        errorOccurredAt: now,
        errorCode: "MOCK_FAILED",
        errorMessage: `Transaction with referenceId ${referenceId} failed.`,
        transactionId: `TXN_${referenceId}_${Date.now()}`,
        reconciliationId: `RECON_${referenceId}_${Date.now()}`,
      };
    }
  }

  async createPlan(plan: PlanCreation): Promise<PlanCreationResponse> {
    console.log("Mock createPlan called with:", plan);
    return {
      _links: {
        self: {
          href: `/rbs/v1/plans/7577512808726664404807`,
          method: "GET",
        },
        update: {
          href: `/rbs/v1/plans/7577512808726664404807`,
          method: "POST",
        },
        deactivate: {
          href: `/rbs/v1/plans/7577512808726664404807/deactivate`,
          method: "POST",
        },
      },
      id: `PLAN_${Date.now()}`,
      status: "COMPLETED",
      submitTimeUtc: new Date().toISOString(),
      planInformation: {
        status: "ACTIVE",
      },
    };
  }

  async getPlan(planId: string): Promise<PlanResponse> {
    console.log("Mock getPlan called with:", planId);
    return {
      _links: {
        self: {
          href: "/rbs/v1/plans/7577512808726664404807",
          method: "GET",
        },
        update: {
          href: "/rbs/v1/plans/7577512808726664404807",
          method: "PATCH",
        },
        deactivate: {
          href: "/rbs/v1/plans/7577512808726664404807/deactivate",
          method: "POST",
        },
      },
      id: "7577512808726664404807",
      submitTimeUtc: "2025-09-13T13:09:53.410Z",
      planInformation: {
        code: "UP1A912B2BAEGXBJ20",
        status: "ACTIVE",
        name: "Gold Plan",
        description: "New Gold Plan",
        billingPeriod: { length: 1, unit: "M" },
        billingCycles: { total: 12 },
      },
      orderInformation: {
        amountDetails: {
          currency: "USD",
          billingAmount: "10.00",
        },
      },
    };
  }

  async createSubscription(
    subscription: Subscription
  ): Promise<SubscriptionResponse> {
    console.log("Mock createSubscription called with:", subscription);
    return {
      _links: {
        self: {
          href: "/rbs/v1/subscriptions/7577512808726664404807",
          method: "GET",
        },
        cancel: {
          href: "/rbs/v1/subscriptions/7577512808726664404807/cancel",
          method: "POST",
        },
        update: {
          href: "/rbs/v1/subscriptions/7577512808726664404807",
          method: "PATCH",
        },
      },
      id: `SUBS_${Date.now()}`,
      status: "ACTIVE",
      submitTimeUtc: new Date().toISOString(),
      subscriptionInformation: {
        status: "ACTIVE",
      },
    };
  }

  async updatePlanForSubscription(
    subscriptionId: string,
    planId: string
  ): Promise<SubscriptionResponse> {
    console.log(
      "Mock updatePlanForSubscription called with:",
      subscriptionId,
      planId
    );
    return {
      _links: {
        self: {
          href: "/rbs/v1/subscriptions/7577512808726664404807",
          method: "GET",
        },
        cancel: {
          href: "/rbs/v1/subscriptions/7577512808726664404807/cancel",
          method: "POST",
        },
        update: {
          href: "/rbs/v1/subscriptions/7577512808726664404807",
          method: "PATCH",
        },
      },
      id: subscriptionId,
      status: "ACTIVE",
      submitTimeUtc: new Date().toISOString(),
      subscriptionInformation: {
        status: "ACTIVE",
      },
    };
  }

  async listOfSubscriptions(): Promise<SubscriptionsListResponse> {
    console.log("Mock listOfSubscriptions called");
    return {
      _links: {
        self: {
          href: "/rbs/v1/subscriptions?status=ACTIVE&limit=2",
          method: "GET",
        },
        next: {
          href: "/rbs/v1/subscriptions?status=ACTIVE&offset=2&limit=2",
          method: "GET",
        },
      },
      totalCount: 29,
      subscriptions: [
        {
          _links: {
            self: {
              href: "/rbs/v1/subscriptions/6192112872526176101960",
              method: "GET",
            },
            update: {
              href: "/rbs/v1/subscriptions/6192112872526176101960",
              method: "PATCH",
            },
            cancel: {
              href: "/rbs/v1/subscriptions/6192112872526176101960/cancel",
              method: "POST",
            },
            suspend: {
              href: "/rbs/v1/subscriptions/6192112872526176101960/suspend",
              method: "POST",
            },
          },
          id: "6192112872526176101960",
          planInformation: {
            code: "34873819306413101960",
            name: "RainTree Books Daily Plan",
            billingPeriod: {
              length: "1",
              unit: "D",
            },
            billingCycles: {
              total: "2",
              current: "1",
            },
          },
          subscriptionInformation: {
            code: "AWC-44",
            planId: "6034873819306413101960",
            name: "Test",
            startDate: "2023-04-13T17:01:42Z",
            status: "ACTIVE",
          },
          paymentInformation: {
            customer: {
              id: "C09F227C54F94951E0533F36CF0A3D91",
            },
          },
          orderInformation: {
            amountDetails: {
              currency: "USD",
              billingAmount: "2.00",
              setupFee: "1.00",
            },
            billTo: {
              firstName: "JENNY",
              lastName: "AUTO",
            },
          },
        },
        {
          _links: {
            self: {
              href: "/rbs/v1/subscriptions/6192115800926177701960",
              method: "GET",
            },
            update: {
              href: "/rbs/v1/subscriptions/6192115800926177701960",
              method: "PATCH",
            },
            cancel: {
              href: "/rbs/v1/subscriptions/6192115800926177701960/cancel",
              method: "POST",
            },
            suspend: {
              href: "/rbs/v1/subscriptions/6192115800926177701960/suspend",
              method: "POST",
            },
          },
          id: "6192115800926177701960",
          planInformation: {
            code: "SITPlanCode6",
            name: "Jan11DeployPlan1",
            billingPeriod: {
              length: "1",
              unit: "W",
            },
            billingCycles: {
              total: "6",
              current: "1",
            },
          },
          subscriptionInformation: {
            code: "AWC-45",
            planId: "6104313186846711501956",
            name: "Testsub1",
            startDate: "2023-04-13T17:01:42Z",
            status: "ACTIVE",
          },
          paymentInformation: {
            customer: {
              id: "C09F227C54F94951E0533F36CF0A3D91",
            },
          },
          orderInformation: {
            amountDetails: {
              currency: "USD",
              billingAmount: "1.00",
              setupFee: "5.00",
            },
            billTo: {
              firstName: "JENNY",
              lastName: "AUTO",
            },
          },
        },
      ],
    };
  }

  async suspendSubscription(
    subscriptionId: string
  ): Promise<SuspendSubscriptionResponse> {
    console.log("Mock suspendSubscription called with:", subscriptionId);
    return {
      _links: {
        self: {
          href: `/rbs/v1/subscriptions/${subscriptionId}`,
          method: "GET",
        },
        update: {
          href: `/rbs/v1/subscriptions/${subscriptionId}`,
          method: "PATCH",
        },
        cancel: {
          href: `/rbs/v1/subscriptions/${subscriptionId}/cancel`,
          method: "POST",
        },
        suspend: {
          href: `/rbs/v1/subscriptions/${subscriptionId}/suspend`,
          method: "POST",
        },
      },
      id: subscriptionId,
      status: "ACCEPTED",
      subscriptionInformation: {
        code: "AWC-44",
        status: "SUSPENDED",
      },
    };
  }
}
