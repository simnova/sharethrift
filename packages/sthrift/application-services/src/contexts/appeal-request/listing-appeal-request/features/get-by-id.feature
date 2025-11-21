Feature: Get Listing Appeal Request By ID

  Scenario: Successfully retrieving a listing appeal request by ID
    Given a valid appeal request ID "appeal-123"
    When the getById command is executed
    Then it should return the listing appeal request entity reference

  Scenario: Handling non-existent appeal request
    Given a non-existent appeal request ID "invalid-id"
    When the getById command is executed
    Then it should return null
