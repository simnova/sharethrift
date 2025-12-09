Feature: Query Admin User By Username

  Scenario: Successfully retrieving an admin user by username
    Given a valid admin user username "admin123"
    And the admin user exists
    When the queryByUsername command is executed
    Then the admin user should be returned

  Scenario: Retrieving non-existent admin user by username
    Given an admin user username "nonexistent123" that does not exist
    When the queryByUsername command is executed
    Then null should be returned
