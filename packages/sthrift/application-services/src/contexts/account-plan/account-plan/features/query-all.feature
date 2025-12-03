Feature: Query All Account Plans

  Scenario: Retrieving all account plans
    Given account plans exist in the system
    When the queryAll command is executed
    Then all account plans should be returned

  Scenario: Retrieving account plans with specific fields
    Given account plans exist in the system
    When the queryAll command is executed with specific fields
    Then account plans with only those fields should be returned

  Scenario: Retrieving all account plans when none exist
    Given no account plans exist in the system
    When the queryAll command is executed
    Then an empty array should be returned
