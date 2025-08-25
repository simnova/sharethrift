import express from "express";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (_: any, res: any) => {
  res.send("Payment Mock Server is running! okokss");
});

import { randomUUID } from "crypto";

app.post("/pts/v2/payments", (req: any, res: any) => {
  const { orderInformation, paymentInformation, clientReferenceInformation } =
    req.body;


  if (
    !orderInformation?.amountDetails?.totalAmount ||
    !orderInformation?.amountDetails?.currency
  ) {
    return res.status(400).json({
      errorInformation: {
        reason: "INVALID_DATA",
        message: "Missing orderInformation.amountDetails fields",
      },
    });
  }
  if (!paymentInformation?.card) {
    return res.status(400).json({
      errorInformation: {
        reason: "INVALID_DATA",
        message: "Missing paymentInformation.card fields",
      },
    });
  }

  const cardNumber = paymentInformation.card.number || "";
  const paymentId = randomUUID();

  // Simulate outcomes
  let status = "AUTHORIZED";
  let errorInfo: any = null;

  if (cardNumber === "4000000000000002") {
    status = "DECLINED";
    errorInfo = {
      reason: "CARD_DECLINED",
      message: "The card was declined.",
    };
  } else if (cardNumber === "4000000000009995") {
    status = "INVALID_REQUEST";
    errorInfo = {
      reason: "INVALID_ACCOUNT",
      message: "Invalid account number.",
    };
  }

  if (errorInfo) {
    return res.status(402).json({
      id: paymentId,
      status,
      clientReferenceInformation: clientReferenceInformation || {},
      errorInformation: errorInfo,
    });
  }

  // Success response
  const response = {
    id: paymentId,
    status,
    clientReferenceInformation: clientReferenceInformation || {},
    orderInformation: {
      amountDetails: orderInformation.amountDetails,
      billTo: orderInformation.billTo || {},
    },
    paymentInformation: {
      card: {
        type: paymentInformation.card.type || "001",
        expirationMonth: paymentInformation.card.expirationMonth,
        expirationYear: paymentInformation.card.expirationYear,
        number: cardNumber.slice(-4),
      },
    },
  };

  res.status(201).json(response);
});

app.post("/pts/v2/refunds", (req: any, res: any) => {
  const { clientReferenceInformation, orderInformation, paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({
      errorInformation: {
        reason: "MISSING_FIELD",
        message: "paymentId is required for refund"
      }
    });
  }

  if (!orderInformation?.amountDetails?.totalAmount) {
    return res.status(400).json({
      errorInformation: {
        reason: "MISSING_FIELD",
        message: "Refund amount is required"
      }
    });
  }

  const refundId = randomUUID();

  const response = {
    id: refundId,
    status: "REFUNDED",
    submittedAgainstPaymentId: paymentId,
    orderInformation: {
      amountDetails: orderInformation.amountDetails
    },
    clientReferenceInformation: clientReferenceInformation || {},
    createdAt: new Date().toISOString(),
    message: `Mock refund of ${orderInformation.amountDetails.totalAmount} ${orderInformation.amountDetails.currency} processed.`
  };

  res.status(201).json(response);
});

app.listen(port, () => {
  console.log(`Payment Mock Server listening on port ${port}`);
});
