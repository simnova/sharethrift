Feature: Update User Appeal Request State

  Scenario: Successfully updating appeal request state to accepted
    Given a valid user appeal request ID "appeal-123"
    And the new state is "accepted"
    When the updateState command is executed
    Then the user appeal request state should be updated
    And the updated user appeal request should be saved
    And the updated entity reference should be returned

  Scenario: Successfully updating appeal request state to denied
    Given a valid user appeal request ID "appeal-123"
    And the new state is "denied"
    When the updateState command is executed
    Then the user appeal request state should be updated to "denied"

  Scenario: Handling missing appeal request ID
    Given an empty user appeal request ID
    When the updateState command is executed
    Then an error should be thrown indicating appeal request id is required

  Scenario: Handling non-existent user appeal request
    Given a non-existent user appeal request ID "invalid-id"
    When the updateState command is executed
    Then an error should be thrown indicating appeal request not found

  Scenario: Handling save failure
    Given a valid user appeal request ID "appeal-123"
    When the updateState command is executed and save fails
    Then an error should be thrown indicating appeal request state update failed
