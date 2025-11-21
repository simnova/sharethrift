Feature: Update Admin User

  Scenario: Successfully updating admin user basic fields
    Given a valid admin user ID "user-123"
    And the admin user exists
    And update data includes isBlocked and roleId
    When the update command is executed
    Then the admin user should be updated
    And the updated user should be returned

  Scenario: Successfully updating admin user account and profile
    Given a valid admin user ID "user-123"
    And the admin user exists
    And update data includes account information
    When the update command is executed
    Then the admin user account should be updated
    And the updated user should be returned

  Scenario: Updating non-existent admin user
    Given an admin user ID "user-999" that does not exist
    When the update command is executed
    Then an error should be thrown with message "admin user not found"

  Scenario: Updating without user ID
    Given no admin user ID is provided
    When the update command is executed
    Then an error should be thrown with message "admin user id is required"
