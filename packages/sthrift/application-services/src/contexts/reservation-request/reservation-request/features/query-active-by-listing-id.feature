Feature: Query Active Reservation Requests By Listing ID

  Scenario: Successfully retrieving active reservation requests for a listing
    Given a valid listing ID "listing-123"
    And there are 2 active reservation requests for the listing
    When the queryActiveByListingId command is executed
    Then 2 reservation requests should be returned

  Scenario: Retrieving active reservation requests for listing with no requests
    Given a valid listing ID "listing-456"
    And there are no active reservation requests for the listing
    When the queryActiveByListingId command is executed
    Then an empty array should be returned
