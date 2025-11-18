Feature: Payment Application Service

  Scenario: Successfully processing a payment
    Given a valid payment request for user "user-123"
    And the payment service processes successfully with transaction "txn-123"
    When the processPayment command is executed
    Then the payment status should be "SUCCEEDED"
    And the transaction ID should be "txn-123"
    And the payment amount should be "100.5"

  Scenario: Handling failed payment with error details
    Given a valid payment request for user "user-123"
    And the payment service fails with error "INSUFFICIENT_FUNDS"
    When the processPayment command is executed
    Then the payment status should be "FAILED"
    And the error reason should be "INSUFFICIENT_FUNDS"
    And the error message should be "Card declined due to insufficient funds"

  Scenario: Handling payment failure without transaction ID
    Given a valid payment request for user "user-123"
    And the payment service fails without transaction ID
    When the processPayment command is executed
    Then the payment status should be "FAILED"
    And the error reason should be "VALIDATION_ERROR"

  Scenario: Handling exceptions during payment processing
    Given a valid payment request for user "user-123"
    And the payment service throws an error
    When the processPayment command is executed
    Then the payment status should be "FAILED"
    And the error reason should be "PROCESSING_ERROR"

  Scenario: Handling non-Error exceptions
    Given a valid payment request for user "user-123"
    And the payment service throws a non-Error exception
    When the processPayment command is executed
    Then the payment status should be "FAILED"
    And the error message should be "Unknown error occurred"

  Scenario: Handling payment success without transaction ID
    Given a valid payment request for user "user-123"
    And the payment service processes successfully without transaction ID
    When the processPayment command is executed
    Then the payment status should be "SUCCEEDED"

  Scenario: Successfully processing a refund with specified amount
    Given a valid refund request for transaction "txn-123"
    And the refund service processes successfully with transaction "refund-123"
    When the refundPayment command is executed
    Then the refund status should be "REFUNDED"
    And the refund transaction ID should be "refund-123"
    And the refund amount should be "50.25"

  Scenario: Using total amount when specific amount not provided
    Given a refund request without specific amount
    And the refund service processes successfully with full amount
    When the refundPayment command is executed
    Then the refund status should be "REFUNDED"
    And the refund amount should be "100.5"

  Scenario: Handling failed refund with error details
    Given a valid refund request for transaction "txn-123"
    And the refund service fails with error "ALREADY_REFUNDED"
    When the refundPayment command is executed
    Then the refund status should be "FAILED"
    And the refund error reason should be "ALREADY_REFUNDED"

  Scenario: Handling refund failure without transaction ID
    Given a valid refund request for transaction "txn-123"
    And the refund service fails without transaction ID
    When the refundPayment command is executed
    Then the refund status should be "FAILED"
    And the refund error reason should be "TRANSACTION_NOT_FOUND"

  Scenario: Handling exceptions during refund processing
    Given a valid refund request for transaction "txn-123"
    And the refund service throws an error
    When the refundPayment command is executed
    Then the refund status should be "FAILED"
    And the refund error reason should be "PROCESSING_ERROR"

  Scenario: Handling refund success without transaction ID
    Given a valid refund request for transaction "txn-123"
    And the refund service processes successfully without transaction ID
    When the refundPayment command is executed
    Then the refund status should be "REFUNDED"
