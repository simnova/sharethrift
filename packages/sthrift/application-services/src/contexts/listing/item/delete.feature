Feature: Delete Item Listing

  Scenario: Successfully delete an owned listing without active reservations
    Given a listing exists with id "listing-123"
    And the listing is owned by user "user@example.com"
    And the listing has no active reservation requests
    When I delete the listing with id "listing-123" as user "user@example.com"
    Then the listing should be deleted successfully

  Scenario: Prevent deletion when active reservation requests exist
    Given a listing exists with id "listing-456"
    And the listing is owned by user "user@example.com"
    And the listing has 2 active reservation requests
    When I try to delete the listing with id "listing-456" as user "user@example.com"
    Then an error should be thrown indicating active reservations must be resolved

  Scenario: Prevent deletion by non-owner via visa permissions
    Given a listing exists with id "listing-789"
    And the listing is owned by user "owner@example.com"
    When I try to delete the listing with id "listing-789" as user "other@example.com"
    Then a permission error should be thrown

  Scenario: Handle user not found error
    Given a listing exists with id "listing-999"
    When I try to delete the listing with id "listing-999" as user "nonexistent@example.com"
    Then an error should be thrown indicating user not found
