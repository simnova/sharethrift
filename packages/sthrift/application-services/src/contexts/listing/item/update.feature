Feature: Update Item Listing

  Scenario: Successfully update listing fields
    Given a listing exists with id "listing-1"
    When I update the listing with all new field values
    Then the listing should be saved with all updated fields

  Scenario: Update listing with date fields
    Given a listing exists with id "listing-2"
    When I update the listing with ISO string dates
    Then the dates should be converted to Date objects correctly

  Scenario: Handle invalid date format
    Given a listing exists with id "listing-3"
    When I update the listing with invalid date "not-a-date"
    Then the update should fail with "Invalid date supplied for listing update"

  Scenario: Save fails due to repository error
    Given a listing exists with id "listing-4"
    When I update the listing but the repository fails to save
    Then the update should fail with "Item listing update failed"
