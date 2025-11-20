Feature: Update Item Listing
  As a listing owner
  I want to update my item listing details
  So that I can keep the listing information current and accurate

  Background:
    Given the listing repository is available

  Scenario: Successfully updating listing title
    Given a listing with id "listing-123" and title "Old Title"
    When I update the listing with title "New Title"
    Then the listing title should be "New Title"
    And the listing should be saved to the repository

  Scenario: Successfully updating multiple fields
    Given a listing with id "listing-123" and multiple fields
    When I update the listing with new values for title, description, category, and location
    Then all fields should be updated with the new values
    And the listing should be saved to the repository

  Scenario: Successfully updating sharing period dates
    Given a listing with id "listing-123" and no sharing period
    When I update the listing with sharing period start "2025-10-10" and end "2025-12-10"
    Then the sharing period should be set correctly
    And the listing should be saved to the repository

  Scenario: Converting string dates to Date objects
    Given a listing with id "listing-123" and no sharing period start
    When I update the listing with sharing period start as string "2025-10-10"
    Then the sharing period start should be a Date object
    And the date should represent "2025-10-10"

  Scenario: Failing to update with invalid date string
    When I update a listing with invalid date string "invalid-date"
    Then an error should be thrown with message "Invalid date supplied for listing update"

  Scenario: Failing to update when UnitOfWork is not available
    Given the ItemListingUnitOfWork is not available
    When I update a listing with title "New Title"
    Then an error should be thrown with message "ItemListingUnitOfWork not available"

  Scenario: Successfully updating images array
    Given a listing with id "listing-123" and empty images array
    When I update the listing with images "img1.png" and "img2.png"
    Then the listing images should contain both images
    And the listing should be saved to the repository

  Scenario: Successfully updating isBlocked status
    Given a listing with id "listing-123"
    When I update the listing with isBlocked status true
    Then the listing setBlocked method should be called with true
    And the listing should be saved to the repository
