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

  Scenario: Updating account type and username
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with account type and username
    Then the account should be updated

  Scenario: Updating user profile with firstName and lastName
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with profile firstName and lastName
    Then the profile names should be updated

  Scenario: Updating user profile with aboutMe
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with aboutMe
    Then the profile aboutMe should be updated

  Scenario: Updating user location with address2
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with location including address2
    Then the location should be updated with address2

  Scenario: Updating user location without address2
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with location without address2
    Then the location should be updated with empty address2

  Scenario: Updating user billing information
    Given a valid user ID "user-123"
    And the user exists
    When the update command is executed with billing information
    Then the billing information should be updated

  Scenario: Update fails when user not found
    Given a valid user ID "user-999"
    And the user does not exist
    When the update command is executed
    Then an error should be thrown with message "personal user not found"

  Scenario: Update fails when save returns undefined
    Given a valid user ID "user-123"
    And the user exists
    And save returns undefined
    When the update command is executed
    Then an error should be thrown with message "personal user update failed"
