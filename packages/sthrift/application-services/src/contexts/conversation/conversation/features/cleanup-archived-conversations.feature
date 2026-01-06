Feature: Cleanup Archived Conversations

  Scenario: Successfully processing conversations for archived listings
    Given archived listings exist with states "Expired" and "Cancelled"
    And each listing has conversations without expiration dates
    When the processConversationsForArchivedListings command is executed
    Then the result should show the correct processed count
    And conversations without expiresAt should be scheduled for deletion
    And the timestamp should be set

  Scenario: Processing when no archived listings exist
    Given no archived listings exist
    When the processConversationsForArchivedListings command is executed
    Then the result should show 0 processed
    And the result should show 0 scheduled

  Scenario: Skipping conversations that already have expiration dates
    Given archived listings exist with conversations
    And some conversations already have expiresAt set
    When the processConversationsForArchivedListings command is executed
    Then only conversations without expiresAt should be scheduled

  Scenario: Handling partial failures during cleanup
    Given archived listings exist
    And an error occurs while processing one listing
    When the processConversationsForArchivedListings command is executed
    Then other listings should still be processed
    And the errors array should contain the failure message

  Scenario: Handling complete failure during cleanup
    Given the repository throws an error
    When the processConversationsForArchivedListings command is executed
    Then an error should be thrown
