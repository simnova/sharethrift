Feature: Query Admin User By Email

  Scenario: Successfully retrieving an admin user by email
    Given a valid admin user email "admin@example.com"
    And the admin user exists
    When the queryByEmail command is executed
    Then the admin user should be returned

  Scenario: Retrieving non-existent admin user by email
    Given an admin user email "nonexistent@example.com" that does not exist
    When the queryByEmail command is executed
    Then null should be returned
