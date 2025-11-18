Feature: Update Personal User

  Scenario: Successfully updating user profile
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with new profile data
    Then the user profile should be updated

  Scenario: Blocking a user
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with isBlocked true
    Then the user should be blocked
