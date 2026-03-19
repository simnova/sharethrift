Feature: Delete Item Listing

  Background:
    Given a valid user with email "test@example.com"
    And the user owns an item listing with id "listing-123"
    And the listing repository is available

  Scenario: Successfully deleting a listing with no active reservations
    Given there are no active reservation requests for the listing
    When the user requests to delete the listing
    Then the listing should be marked as deleted
    And the listing should be saved to the repository

  Scenario: Failing to delete a listing with active reservations
    Given there are 2 active reservation requests for the listing
    When the user requests to delete the listing
    Then an error should be thrown with message "Cannot delete listing with active reservation requests"
    And the listing should not be marked as deleted

  Scenario: Failing to delete when user is not found
    Given the user email "nonexistent@example.com" does not exist
    When the user with email "nonexistent@example.com" requests to delete the listing
    Then an error should be thrown with message "User not found"

  Scenario: Failing to delete when listing is not found
    Given the listing with id "nonexistent-listing" does not exist
    When the user requests to delete the listing with id "nonexistent-listing"
    Then an error should be thrown with message "Listing not found"

  Scenario: Failing to delete when unit of work is not available
    Given the unit of work is not available
    When the user requests to delete the listing
    Then an error should be thrown with message "ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing"
