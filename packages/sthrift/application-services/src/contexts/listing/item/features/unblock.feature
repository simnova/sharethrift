Feature: Unblock Item Listing
  As a system administrator
  I want to unblock an item listing
  So that it can be made available again to users

  Background:
    Given the listing repository is available

  Scenario: Successfully unblocking a listing
    Given a blocked listing with id "listing-123"
    When I request to unblock the listing
    Then the listing should be marked as unblocked
    And the listing should be saved to the repository
    And the result should contain the updated listing reference

  Scenario: Failing to unblock when listing is not found
    Given the listing with id "listing-123" does not exist
    When I request to unblock the listing
    Then an error should be thrown with message "Listing not found"

  Scenario: Failing to unblock when save returns undefined
    Given a blocked listing with id "listing-123"
    And the repository save operation returns undefined
    When I request to unblock the listing
    Then an error should be thrown with message "ItemListing not updated"
