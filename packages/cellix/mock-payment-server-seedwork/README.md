# @cellix/mock-payment-server-seedwork

Core payment server mock logic for CellixJS monorepo. This seedwork contains all business logic for the payment server but is agnostic to project-specific configuration.

## Usage

```typescript
import { startMockPaymentServer, type PaymentConfig } from '@cellix/mock-payment-server-seedwork';

const config: PaymentConfig = {
  port: 3001,
  protocol: 'http',
  paymentHost: 'localhost:3001',
  frontendBaseUrl: 'http://localhost:3000',
  paymentBaseUrl: 'http://localhost:3001',
};

startMockPaymentServer(config).catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
```

## Endpoints

- GET /pts/v2/public-key — generatePublicKey endpoint
- POST /pts/v2/customers — createCustomerProfile endpoint
- GET /pts/v2/customers/:customerId — getCustomerProfile endpoint
- POST /tms/v2/customers/:customerId/payment-instruments — addCustomerPaymentInstrument endpoint
- GET /tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId — getCustomerPaymentInstrument endpoint
- GET /tms/v2/customers/:customerId/payment-instruments — getCustomerPaymentInstruments endpoint
- DELETE /tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId — deleteCustomerPaymentInstrument endpoint
- PATCH /tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId — updateCustomerPaymentInstrument endpoint
- POST /pts/v2/payments — processPayment endpoint
- POST /pts/v2/refunds — processRefund endpoint
- POST /rbs/v1/plans — createPlan endpoint
- GET /rbs/v1/plans — listOfPlans endpoint
- GET /rbs/v1/plans/:planId — getPlan endpoint
- POST /rbs/v1/subscriptions — createSubscription endpoint
- PATCH /rbs/v1/subscriptions/:subscriptionId — updatePlanForSubscription endpoint
- GET /rbs/v1/subscriptions — listOfSubscriptions endpoint
- POST /rbs/v1/subscriptions/:subscriptionId/suspend — suspendSubscription endpoint

## API

- `startMockPaymentServer(config: PaymentConfig): Promise<void>` - Starts the payment server with the given configuration.

## Configuration

The `PaymentConfig` interface accepts:
- `port`: Port to run the server on
- `protocol`: 'http' or 'https'
- `paymentHost`: Host for the payment server (used in URLs)
- `frontendBaseUrl`: Frontend base URL for CORS
- `paymentBaseUrl`: Payment server base URL (used in responses)
- `certKeyPath?: string`: Optional path to SSL certificate key
- `certPath?: string`: Optional path to SSL certificate
- `iframeJsPath?: string`: Optional path to serve iframe.min.js static file
