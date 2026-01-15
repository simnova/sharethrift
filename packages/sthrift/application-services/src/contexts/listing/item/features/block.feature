Feature: Block Item Listing
  As an admin user
  I want to block a specific item listing
  So that I can prevent it from being visible or active in the system

  Background:
    Given a data source with listing repositories
    And a listing repository with ItemListingUnitOfWork transaction support

  Scenario: Successfully block an existing item listing
    Given an item listing exists with ID "test-listing-id"
    And the listing is not blocked
    When I block the listing with ID "test-listing-id"
    Then the listing should be retrieved by its ID
    And the blocked property should be set to true
    And the listing should be saved to the repository
    And the updated listing should be returned

  Scenario: Attempt to block a non-existent listing
    Given no listing exists with ID "non-existent-id"
    When I attempt to block the listing with ID "non-existent-id"
    Then an error should be thrown with message "Listing not found"
    And the repository save method should not be called

  Scenario: Save operation fails to update the listing
    Given an item listing exists with ID "test-listing-id"
    And the save operation will not persist the listing
    When I block the listing with ID "test-listing-id"
    Then an error should be thrown with message "ItemListing not updated"
    And the operation should fail with the update error
