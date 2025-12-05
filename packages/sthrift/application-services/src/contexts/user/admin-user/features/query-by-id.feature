Feature: Query Admin User By ID

  Scenario: Successfully retrieving an admin user by ID
    Given a valid admin user ID "user-123"
    And the admin user exists
    When the queryById command is executed
    Then the admin user should be returned

  Scenario: Retrieving non-existent admin user
    Given an admin user ID "user-999" that does not exist
    When the queryById command is executed
    Then null should be returned
