Feature: Create User Appeal Request

  Scenario: Successfully creating a user appeal request
    Given a valid user ID "user-123"
    And a valid reason "Violation of community guidelines"
    And a valid blocker ID "blocker-456"
    When the create command is executed
    Then a new user appeal request should be created
    And the created appeal request should have the user ID "user-123"
    And the appeal request should be returned with an ID

  Scenario: Handling repository save failure
    Given valid user appeal request data
    When the create command is executed and save fails
    Then an error should be thrown indicating failed to create user appeal request
