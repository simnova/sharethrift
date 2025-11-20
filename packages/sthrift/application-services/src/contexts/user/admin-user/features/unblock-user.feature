Feature: Unblock Admin User

  Scenario: Successfully unblocking an admin user
    Given a valid admin user ID "user-123"
    And the admin user exists and is blocked
    When the unblockUser command is executed
    Then the admin user should be unblocked
    And the unblocked user should be returned

  Scenario: Unblocking non-existent admin user
    Given an admin user ID "user-999" that does not exist
    When the unblockUser command is executed
    Then an error should be thrown with message "admin user not found"
