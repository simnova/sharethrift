Feature: Query Account Plan By Name

  Scenario: Retrieving an existing account plan by name
    Given an account plan exists with name "Premium Plan"
    When the queryByName command is executed with name "Premium Plan"
    Then the account plan should be returned

  Scenario: Retrieving a non-existent account plan by name
    Given no account plan exists with name "Non-Existent Plan"
    When the queryByName command is executed with name "Non-Existent Plan"
    Then null should be returned

  Scenario: Retrieving account plan by exact name match
    Given an account plan exists with name "Basic Plan"
    When the queryByName command is executed with name "Basic Plan"
    Then the correct account plan should be returned
