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

  Scenario: Creation fails when save returns undefined
    Given a valid email "fail@example.com"
    And the user does not exist
    And the repository save returns undefined
    When the createIfNotExists command is executed
    Then an error should be thrown with message "personal user not found"
