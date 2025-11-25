Feature: Pause Item Listing
  As a listing owner
  I want to temporarily pause my listing
  So that it is hidden from borrowers until I resume it

  Background:
    Given the listing repository is available

  Scenario: Successfully pausing a listing
    Given an active listing with id "listing-123"
    When I request to pause the listing
    Then the listing should be marked as paused
    And the listing should be saved to the repository
    And the result should contain the paused listing reference

  Scenario: Failing to pause when listing is not found
    Given the listing with id "listing-123" does not exist
    When I request to pause the listing
    Then an error should be thrown with message "Listing not found"

  Scenario: Failing to pause when save returns undefined
    Given an active listing with id "listing-123"
    And the repository save operation returns undefined
    When I request to pause the listing
    Then an error should be thrown with message "ItemListing not paused"
