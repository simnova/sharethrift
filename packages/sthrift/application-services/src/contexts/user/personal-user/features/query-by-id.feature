Feature: Query Personal User By ID

  Scenario: Successfully retrieving a personal user by ID
    Given a valid user ID "user-123"
    And the user exists
    When the queryById command is executed
    Then the user should be returned

  Scenario: Retrieving non-existent user
    Given a user ID "user-999" that does not exist
    When the queryById command is executed
    Then null should be returned
