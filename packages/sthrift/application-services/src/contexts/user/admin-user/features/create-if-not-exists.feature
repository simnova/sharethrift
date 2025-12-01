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

  Scenario: Creation fails when save returns undefined
    Given an admin user with email "fail@example.com" does not exist
    And valid user details are provided
    And the repository save returns undefined
    When the createIfNotExists command is executed
    Then an error should be thrown with message "admin user not created"

  Scenario: Creation fails when re-query returns undefined
    Given an admin user with email "fail2@example.com" does not exist
    And valid user details are provided
    And the re-query after save returns undefined
    When the createIfNotExists command is executed
    Then an error should be thrown with message "admin user not found after creation"
