Feature: Create Listing Appeal Request

  Scenario: Successfully creating a listing appeal request
    Given valid appeal request data with userId, listingId, reason, and blockerId
    When the create command is executed
    Then a new listing appeal request should be created
    And the appeal request should be saved to the repository
    And the appeal request entity reference should be returned

  Scenario: Handling repository save failure
    Given valid appeal request data
    When the create command is executed and save fails
    Then an error should be thrown indicating failed to create listing appeal request
