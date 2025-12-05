Feature: UserAppealRequest Aggregate

  Background:
    Given a valid passport with appeal request permissions

  Scenario: Creating a new UserAppealRequest instance
    When I create a new UserAppealRequest with userId "user123", reason "This user was incorrectly blocked", and blockerId "blocker789"
    Then the user id should be "user123"
    And the reason should be "This user was incorrectly blocked"
    And the state should be "requested"
    And the type should be "user"
    And the blocker id should be "blocker789"

  Scenario: Getting the reason
    When I get the reason from the appeal request
    Then the reason should match the stored value

  Scenario: Setting the reason with permission
    Given the passport has permission to update appeal request state
    When I set the reason to "Updated reason for user appeal"
    Then the reason should be "Updated reason for user appeal"

  Scenario: Setting the reason without permission
    Given the passport does not have permission to update appeal request state
    When I try to set the reason to "Unauthorized change"
    Then a permission error should be thrown with message "You do not have permission to update the reason"

  Scenario: Getting the state
    When I get the state from the appeal request
    Then the state should match the stored value

  Scenario: Setting the state with permission
    Given the passport has permission to update appeal request state
    When I set the state to "accepted"
    Then the state should be "accepted"

  Scenario: Setting the state without permission
    Given the passport does not have permission to update appeal request state
    When I try to set the state to "accepted"
    Then a permission error should be thrown with message "You do not have permission to update the state"

  Scenario: Getting the user reference
    When I get the user from the appeal request
    Then the user reference should be a PersonalUser entity

  Scenario: Getting the blocker reference
    When I get the blocker from the appeal request
    Then the blocker reference should be a PersonalUser entity

  Scenario: Getting the type
    When I get the type from the appeal request
    Then the type should be "user"

  Scenario: Getting createdAt timestamp
    When I get the createdAt from the appeal request
    Then the createdAt should be a valid Date

  Scenario: Getting updatedAt timestamp
    When I get the updatedAt from the appeal request
    Then the updatedAt should be a valid Date

  Scenario: Getting schemaVersion
    When I get the schemaVersion from the appeal request
    Then the schemaVersion should be a non-empty string
