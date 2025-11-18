Feature: Cancel Item Listing

  Scenario: Successfully cancelling an active listing
    Given a valid listing ID "listing-123"
    And the listing exists and is active
    When the cancel command is executed
    Then the listing should be cancelled

  Scenario: Attempting to cancel a non-existent listing
    Given a listing ID "listing-999"
    And the listing does not exist
    When the cancel command is executed
    Then an error "Listing not found" should be thrown
