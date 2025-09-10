import express from "express";
import type { Request, Response } from "express";
import { randomUUID } from "crypto";

interface PaymentRequest {
  clientReferenceInformation?: {
    userId: string;
    [key: string]: any;
  };
  orderInformation: {
    amountDetails: {
      totalAmount: number;
      currency: string;
    };
    billTo: {
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phoneNumber?: string;
      email?: string;
    };
  };
  paymentInformation: {
    card: {
      number: string;
      expirationMonth: string;
      expirationYear: string;
      securityCode: string;
    };
  };
}

interface RefundRequest {
  paymentId: string;
  clientReferenceInformation?: {
    userId: string;
    [key: string]: any;
  };
  orderInformation: {
    amountDetails: {
      totalAmount: number;
      currency: string;
    };
  };
}

interface PaymentResponse {
  id: string;
  status: string;
  errorInformation?: {
    reason?: string;
    message?: string;
  };
  orderInformation?: {
    amountDetails?: {
      totalAmount?: string;
      currency?: string;
    };
  };
}

interface RefundResponse {
  id: string;
  status: string;
  errorInformation?: {
    reason?: string;
    message?: string;
  };
  orderInformation?: {
    amountDetails?: {
      totalAmount?: string;
      currency?: string;
    };
  };
}

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Payment Mock Server is running!");
});

app.post("/pts/v2/payments", (req: Request<{}, {}, PaymentRequest>, res: Response<PaymentResponse>) => {
  const { orderInformation, paymentInformation } = req.body;

  if (!orderInformation?.amountDetails?.totalAmount || !orderInformation?.amountDetails?.currency) {
    return res.status(400).json({
      id: randomUUID(),
      status: "INVALID_REQUEST",
      errorInformation: {
        reason: "INVALID_DATA",
        message: "Missing orderInformation.amountDetails fields",
      }
    });
  }

  if (!paymentInformation?.card) {
    return res.status(400).json({
      id: randomUUID(),
      status: "INVALID_REQUEST",
      errorInformation: {
        reason: "INVALID_DATA",
        message: "Missing paymentInformation.card fields",
      }
    });
  }

  const cardNumber = paymentInformation.card.number;
  const paymentId = randomUUID();

  // Simulate different payment scenarios based on card number
  switch (cardNumber) {
    case "4000000000000002":
      return res.status(402).json({
        id: paymentId,
        status: "DECLINED",
        errorInformation: {
          reason: "CARD_DECLINED",
          message: "The card was declined.",
        }
      });

    case "4000000000009995":
      return res.status(400).json({
        id: paymentId,
        status: "INVALID_REQUEST",
        errorInformation: {
          reason: "INVALID_ACCOUNT",
          message: "Invalid account number.",
        }
      });

    default:
      const response: PaymentResponse = {
        id: paymentId,
        status: "SUCCEEDED",
        orderInformation: {
          amountDetails: {
            totalAmount: orderInformation.amountDetails.totalAmount.toString(),
            currency: orderInformation.amountDetails.currency,
          }
        },
      };

      return res.status(201).json(response);
  }
});

app.post("/pts/v2/refunds", (req: Request<{}, {}, RefundRequest>, res: Response<RefundResponse>) => {
  const { orderInformation, paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({
      id: randomUUID(),
      status: "FAILED",
      orderInformation: { amountDetails: { totalAmount: "0", currency: "" } },
      errorInformation: {
        reason: "MISSING_FIELD",
        message: "paymentId is required for refund"
      }
    });
  }

  if (!orderInformation?.amountDetails?.totalAmount) {
    return res.status(400).json({
      id: randomUUID(),
      status: "FAILED",
      orderInformation: { amountDetails: { totalAmount: "0", currency: "" } },
      errorInformation: {
        reason: "MISSING_FIELD",
        message: "Refund amount is required"
      }
    });
  }

  const refundId = randomUUID();

  const response: RefundResponse = {
    id: refundId,
    status: "REFUNDED",
    orderInformation: {
      amountDetails: {
        totalAmount: orderInformation.amountDetails.totalAmount.toString(),
        currency: orderInformation.amountDetails.currency
      }
    },  };

  return res.status(201).json(response);
});

app.listen(port, () => {
  console.log(`Payment Mock Server listening on port ${port}`);
});

