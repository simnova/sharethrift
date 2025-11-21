Feature: Create Admin User If Not Exists

  Scenario: Creating a new admin user
    Given an admin user with email "admin@example.com" does not exist
    And valid user details are provided
    When the createIfNotExists command is executed
    Then a new admin user should be created
    And the created user should be returned

  Scenario: Admin user already exists
    Given an admin user with email "existing@example.com" already exists
    When the createIfNotExists command is executed
    Then the existing admin user should be returned
    And no new user should be created
