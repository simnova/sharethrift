Feature: Personal User Account Profile Billing Transactions

  Background:
    Given I have valid billing transactions props

  Scenario: Creating a billing transactions instance
    When I create a PersonalUserAccountProfileBillingTransactions instance
    Then the transactions instance should be created successfully

  Scenario: Getting transactionId from transactions
    Given I have a transaction with transactionId "txn-12345"
    When I access the transactionId property
    Then it should return "txn-12345"

  Scenario: Getting amount from transactions
    Given I have a transaction with amount 99.99
    When I access the amount property
    Then it should return 99.99

  Scenario: Getting referenceId from transactions
    Given I have a transaction with referenceId "ref-12345"
    When I access the referenceId property
    Then it should return "ref-12345"

  Scenario: Getting status from transactions
    Given I have a transaction with status "SUCCEEDED"
    When I access the status property
    Then it should return "SUCCEEDED"

  Scenario: Getting completedAt from transactions
    Given I have a transaction with a valid completedAt date
    When I access the completedAt property
    Then it should return the expected date

  Scenario: Getting errorMessage from transactions when null
    Given I have a transaction with no errorMessage
    When I access the errorMessage property
    Then it should return null

  Scenario: Getting errorMessage from transactions when set
    Given I have a transaction with errorMessage "Payment failed"
    When I access the errorMessage property
    Then it should return "Payment failed"

  Scenario: Setting transactionId with valid visa
    Given I have a transaction with a permissive visa
    When I set the transactionId to "txn-new-123"
    Then the transactionId should be updated to "txn-new-123"

  Scenario: Setting amount with valid visa
    Given I have a transaction with a permissive visa
    When I set the amount to 149.99
    Then the amount should be updated to 149.99

  Scenario: Setting referenceId with valid visa
    Given I have a transaction with a permissive visa
    When I set the referenceId to "ref-new-123"
    Then the referenceId should be updated to "ref-new-123"

  Scenario: Setting status with valid visa
    Given I have a transaction with a permissive visa
    When I set the status to "FAILED"
    Then the status should be updated to "FAILED"

  Scenario: Setting completedAt with valid visa
    Given I have a transaction with a permissive visa
    When I set the completedAt to a new date
    Then the completedAt should be updated

  Scenario: Setting errorMessage with valid visa
    Given I have a transaction with a permissive visa
    When I set the errorMessage to "Network error"
    Then the errorMessage should be updated to "Network error"

  Scenario: Setting transactionId without permission throws error
    Given I have a transaction with a restrictive visa
    When I attempt to set the transactionId without permission
    Then it should throw a PermissionError for transaction

  Scenario: Setting amount without permission throws error
    Given I have a transaction with a restrictive visa
    When I attempt to set the amount without permission
    Then it should throw a PermissionError for transaction

  Scenario: Setting referenceId without permission throws error
    Given I have a transaction with a restrictive visa
    When I attempt to set the referenceId without permission
    Then it should throw a PermissionError for transaction

  Scenario: Setting status without permission throws error
    Given I have a transaction with a restrictive visa
    When I attempt to set the status without permission
    Then it should throw a PermissionError for transaction

  Scenario: Setting completedAt without permission throws error
    Given I have a transaction with a restrictive visa
    When I attempt to set the completedAt without permission
    Then it should throw a PermissionError for transaction

  Scenario: Setting errorMessage without permission throws error
    Given I have a transaction with a restrictive visa
    When I attempt to set the errorMessage without permission
    Then it should throw a PermissionError for transaction

  Scenario: Setting properties when entity is new bypasses visa check
    Given I have a transaction for a new entity
    When I set the transactionId to "txn-new-entity"
    Then the transactionId should be updated to "txn-new-entity"
