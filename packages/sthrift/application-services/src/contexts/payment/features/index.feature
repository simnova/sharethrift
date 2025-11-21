Feature: Payment Module Exports

  Scenario: Exporting DefaultPaymentApplicationService class
    When the payment module is imported
    Then it should export DefaultPaymentApplicationService class
    And the class should be a function constructor

  Scenario: Exporting PaymentApplicationService interface
    When the payment module is imported
    Then it should export PaymentApplicationService interface type
    And the interface should define processPayment method
    And the interface should define refundPayment method

  Scenario: Exporting ProcessPaymentRequest interface
    When the payment module is imported
    Then it should export ProcessPaymentRequest interface type
    And the interface should define userId property
    And the interface should define orderInformation property
    And the interface should define paymentInformation property

  Scenario: Exporting ProcessPaymentResponse interface
    When the payment module is imported
    Then it should export ProcessPaymentResponse interface type
    And the interface should allow optional id property
    And the interface should allow optional status property
    And the interface should allow optional errorInformation property

  Scenario: Exporting RefundPaymentRequest interface
    When the payment module is imported
    Then it should export RefundPaymentRequest interface type
    And the interface should define userId property
    And the interface should define transactionId property
    And the interface should define optional amount property
    And the interface should define orderInformation property

  Scenario: Exporting RefundPaymentResponse interface
    When the payment module is imported
    Then it should export RefundPaymentResponse interface type
    And the interface should allow optional id property
    And the interface should define status property
    And the interface should allow optional errorInformation property
