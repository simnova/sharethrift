Feature: Process Payment

  Scenario: Payment data source is not available
    Given the payment data source is undefined
    When the processPayment command is executed
    Then an error should be thrown with message "Payment data source is not available"

  Scenario: User not found during payment processing
    Given the payment data source is available
    And the user does not exist
    When the processPayment command is executed
    Then a failed payment response should be returned with message "User not found"

  Scenario: Account plan not found during payment processing
    Given the payment data source is available
    And the user exists
    And the account plan does not exist
    When the processPayment command is executed
    Then a failed payment response should be returned with message "Account plan not found"

  Scenario: No valid payment instrument found
    Given the payment data source is available
    And the user exists
    And the account plan exists
    And customer profile is created
    And no payment instrument is available
    When the processPayment command is executed
    Then a failed payment response should be returned with message "No valid payment instrument found"

  Scenario: Payment processing fails
    Given the payment data source is available
    And the user exists
    And the account plan exists
    And customer profile is created
    And payment instrument is available
    And payment processing fails
    When the processPayment command is executed
    Then a failed payment response should be returned with message "Payment processing failed"

  Scenario: Successfully processing a payment
    Given the payment data source is available
    And the user exists
    And the account plan exists
    And customer profile is created
    And payment instrument is available
    And payment processing succeeds
    And subscription is created
    When the processPayment command is executed
    Then a successful payment response should be returned

  Scenario: Processing payment with optional billing fields
    Given the payment data source is available
    And the user exists
    And the account plan exists
    And customer profile is created
    And payment instrument is available
    And payment processing succeeds
    And subscription is created
    And the payment request has empty optional fields
    When the processPayment command is executed
    Then a successful payment response should be returned
