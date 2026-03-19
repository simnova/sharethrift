Feature: Block Admin User

  Scenario: Successfully blocking an admin user
    Given a valid admin user ID "user-123"
    And the admin user exists
    When the blockUser command is executed
    Then the admin user should be blocked
    And the blocked user should be returned

  Scenario: Blocking non-existent admin user
    Given an admin user ID "user-999" that does not exist
    When the blockUser command is executed
    Then an error should be thrown with message "admin user not found"

  Scenario: Blocking admin user fails when save returns undefined
    Given a valid admin user ID "user-123"
    And the admin user exists but save returns undefined
    When the blockUser command is executed
    Then an error should be thrown with message "admin user block failed"
