Feature: Generate Public Key

  Scenario: Successfully generating a public key
    Given the payment data source is available
    When the generatePublicKey command is executed
    Then a public key should be returned

  Scenario: Generating public key when payment data source returns null
    Given the payment data source returns null for public key
    When the generatePublicKey command is executed
    Then an error should be thrown with message "Payment data source is not available"

  Scenario: Generating public key when payment data source is undefined
    Given the payment data source is undefined
    When the generatePublicKey command is executed
    Then an error should be thrown with message "Payment data source is not available"
