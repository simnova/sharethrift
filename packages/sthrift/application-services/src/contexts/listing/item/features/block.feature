Feature: Block Item Listing
  As an administrator
  I want to block item listings
  So that I can prevent listings that violate policies from being viewed by users

  Background:
    Given the listing repository is available

  Scenario: Successfully blocking a listing
    Given an active listing with id "listing-123"
    When I request to block the listing
    Then the listing should be marked as blocked
    And the listing should be saved to the repository
    And the result should contain the updated listing reference

  Scenario: Failing to block when listing is not found
    Given the listing with id "listing-123" does not exist
    When I request to block the listing
    Then an error should be thrown with message "Listing not found"

  Scenario: Failing to block when save returns undefined
    Given an active listing with id "listing-123"
    And the repository save operation returns undefined
    When I request to block the listing
    Then an error should be thrown with message "ItemListing not updated"
