Feature: Unblock Item Listing

  Scenario: Successfully unblock a listing
    Given a listing exists with id "listing-123"
    And the listing is currently blocked
    When I unblock the listing with id "listing-123"
    Then the listing isBlocked flag should be set to false
    And the listing should be saved successfully

  Scenario: Handle listing not found
    When I try to unblock a listing with id "nonexistent-listing"
    Then an error should be thrown indicating listing not found

  Scenario: Handle save failure
    Given a listing exists with id "listing-456"
    And the repository will fail to save
    When I try to unblock the listing with id "listing-456"
    Then an error should be thrown indicating save failure
