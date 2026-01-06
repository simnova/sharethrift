Feature: Schedule Deletion By Listing

  Scenario: Successfully scheduling deletion for conversations
    Given a valid listing ID "listing-123"
    And an archival date of "2025-01-15"
    And 2 conversations exist for the listing
    When the scheduleDeletionByListing command is executed
    Then the result should show 2 conversations scheduled
    And all conversation IDs should be returned
    And the expiresAt should be set to 6 months after the archival date

  Scenario: Scheduling deletion when no conversations exist
    Given a valid listing ID "listing-no-convos"
    And an archival date of "2025-01-15"
    And no conversations exist for the listing
    When the scheduleDeletionByListing command is executed
    Then the result should show 0 conversations scheduled
    And an empty array of conversation IDs should be returned

  Scenario: Handling errors during scheduling
    Given a valid listing ID "listing-error"
    And an archival date of "2025-01-15"
    And the repository throws an error
    When the scheduleDeletionByListing command is executed
    Then an error should be thrown
