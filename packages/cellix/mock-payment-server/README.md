# Payment Mock Server
A simple Express-based mock server for payment API testing.


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