import express from "express";
import type { Request, Response } from "express";
import type {
  CustomerProfile,
  PaymentTokenInfo,
  PaymentTransactionResponse,
  CustomerPaymentResponse,
  CustomerPaymentInstrumentResponse,
  CustomerPaymentInstrumentsResponse,
} from "./payment-interface.ts";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Payment Mock Server is running!");
});

// createCustomerProfile endpoint
app.get("/pts/v2/public-key", (_req: Request, res: Response) => {
  return res.status(200).json({
    publicKey: "MOCK_PUBLIC_KEY_1234567890",
  });
});

// createCustomerProfile endpoint
app.post(
  "/pts/v2/customers",
  (
    req: Request<
      {},
      {},
      { customerProfile: CustomerProfile; paymentTokenInfo: PaymentTokenInfo }
    >,
    res: Response<PaymentTransactionResponse>
  ) => {
    const { customerProfile, paymentTokenInfo } = req.body;

    console.log(
      "Mock createCustomerProfile called with:",
      customerProfile,
      paymentTokenInfo
    );

    const mockResponse: PaymentTransactionResponse = {
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

    return res.status(201).json(mockResponse);
  }
);

// getCustomerProfile endpoint
app.get(
  "/pts/v2/customers/:customerId",
  (
    req: Request<{ customerId: string }>,
    res: Response<CustomerPaymentResponse>
  ) => {
    const { customerId } = req.params;

    console.log("Mock getCustomerProfile called with:", customerId);

    const mockResponse: CustomerPaymentResponse = {
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
            address2: "Suite 100",
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
          metadata: {
            creator: "mock_service",
          },
          instrumentIdentifier: {
            id: "MOCK_INSTRUMENT_123",
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
                      previousTransactionId: "TXN-MOCK-INIT-0001",
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

    return res.status(200).json(mockResponse);
  }
);

// addCustomerPaymentInstrument endpoint
app.post(
  "/tms/v2/customers/:customerId/payment-instruments",
  (
    req: Request<
      { customerId: string },
      {},
      { customerProfile: CustomerProfile; paymentTokenInfo: PaymentTokenInfo }
    >,
    res: Response<PaymentTransactionResponse>
  ) => {
    const { customerId } = req.params;
    const { customerProfile, paymentTokenInfo } = req.body;
    console.log(
      "Mock addCustomerPaymentInstrument called with:",
      customerId,
      customerProfile,
      paymentTokenInfo
    );

    const mockResponse: PaymentTransactionResponse = {
      _links: {
        self: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/MOCK_INSTRUMENT_456`,
          method: "GET",
        },
        capture: {
          href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/MOCK_INSTRUMENT_456/capture`,
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
        customer: { id: customerId },
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
        customer: { id: customerId },
      },
      voidAmountDetails: {
        voidAmount: "0.00",
        currency: "USD",
      },
    };

    return res.status(201).json(mockResponse);
  }
);

// getCustomerPaymentInstrument endpoint
app.get(
  "/tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId",
  async (
    req: Request<{ customerId: string; paymentInstrumentId: string }>,
    res: Response<CustomerPaymentInstrumentResponse>
  ) => {
    try {
      const { customerId, paymentInstrumentId } = req.params;

      const mockResponse: CustomerPaymentInstrumentResponse = {
        _links: {
          self: {
            href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
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
      res.status(200).json(mockResponse);
    } catch (err) {
      console.error("Mock error:", err);
      res.status(500).json({ error: "Internal mock error" } as any);
    }
  }
);

// getCustomerPaymentInstruments endpoint
app.get(
  "/tms/v2/customers/:customerId/payment-instruments",
  async (
    req: Request<{ customerId: string }>,
    res: Response<CustomerPaymentInstrumentsResponse>
  ) => {
    const { customerId } = req.params;
    const offset = Number((req.query["offset"] as string) ?? 0);
    const limit = Number((req.query["limit"] as string) ?? 10);

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

    const response = {
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

    res.status(200).json(response);
  }
);

// deleteCustomerPaymentInstrument endpoint
app.delete(
  "/tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId",
  (req: Request<{ customerId: string; paymentInstrumentId: string }>, res: Response) => {
    const { customerId, paymentInstrumentId } = req.params;
    console.log("Mock deleteCustomerPaymentInstrument called with:", customerId, paymentInstrumentId);
    res.status(204).send();
  }
);

app.listen(port, () => {
  console.log(`Payment Mock Server listening on port ${port}`);
});
