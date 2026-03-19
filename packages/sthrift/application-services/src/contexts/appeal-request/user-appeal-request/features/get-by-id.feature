Feature: Get User Appeal Request By ID

  Scenario: Successfully retrieving a user appeal request by ID
    Given a valid user appeal request ID "appeal-123"
    When the getById command is executed
    Then the user appeal request should be returned
    And the returned appeal request should have ID "appeal-123"

  Scenario: Handling non-existent user appeal request ID
    Given a non-existent user appeal request ID "invalid-id"
    When the getById command is executed
    Then null should be returned
