Feature: Create User If Not Exists

  Scenario: Creating a new user
    Given a valid email "user@example.com"
    And the user does not exist
    When the createIfNotExists command is executed
    Then a new user should be created

  Scenario: User already exists
    Given a valid email "existing@example.com"
    And the user already exists
    When the createIfNotExists command is executed
    Then the existing user should be returned
