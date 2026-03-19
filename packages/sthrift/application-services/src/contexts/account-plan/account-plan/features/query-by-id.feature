Feature: Query Account Plan By ID

  Scenario: Retrieving an existing account plan by ID
    Given an account plan exists with ID "plan-123"
    When the queryById command is executed with ID "plan-123"
    Then the account plan should be returned

  Scenario: Retrieving account plan by ID with specific fields
    Given an account plan exists with ID "plan-456"
    When the queryById command is executed with specific fields
    Then the account plan with only those fields should be returned

  Scenario: Retrieving a non-existent account plan by ID
    Given no account plan exists with ID "non-existent"
    When the queryById command is executed with ID "non-existent"
    Then null should be returned
