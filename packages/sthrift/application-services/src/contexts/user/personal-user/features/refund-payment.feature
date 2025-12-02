Feature: Refund Payment

  Scenario: Refund amount is zero
    Given a refund request with amount zero
    When the refundPayment command is executed
    Then a failed refund response should be returned with message "Refund amount must be greater than zero"

  Scenario: Refund amount is undefined
    Given a refund request with undefined amount
    When the refundPayment command is executed
    Then a failed refund response should be returned with message "Refund amount must be greater than zero"

  Scenario: Refund processing fails without transaction ID
    Given a valid refund request
    And the payment data source returns a failed refund without transaction ID
    When the refundPayment command is executed
    Then a failed refund response should be returned without transaction ID

  Scenario: Refund processing fails with transaction ID
    Given a valid refund request
    And the payment data source returns a failed refund with transaction ID
    When the refundPayment command is executed
    Then a failed refund response should be returned with transaction ID

  Scenario: Successfully processing a refund without transaction ID
    Given a valid refund request
    And the payment data source returns a successful refund without transaction ID
    When the refundPayment command is executed
    Then a successful refund response should be returned without transaction ID

  Scenario: Successfully processing a refund with transaction ID
    Given a valid refund request
    And the payment data source returns a successful refund with transaction ID
    When the refundPayment command is executed
    Then a successful refund response should be returned with transaction ID

  Scenario: Refund processing throws an error
    Given a valid refund request
    And the payment data source throws an error
    When the refundPayment command is executed
    Then a failed refund response should be returned with error information
